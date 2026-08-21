import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPricing, EARLY_BIRD_SEAT_LIMITS } from "@/lib/razorpay/config";

const ProfileData = z.object({
  phone: z.string().regex(/^\d{10}$/, "Phone number should be 10 digits long"),

  college: z
    .string()
    .min(2, "College name must be at least 2 characters")
    .max(100),

  department: z.string().min(1, "Department is required"),

  degree: z.string().min(1, "Degree is required"),

  year: z.coerce
    .number()
    .int()
    .min(1, "Year must be between 1 and 6")
    .max(6, "Year must be between 1 and 6"),

  foodPreference: z.enum(["VEG", "NON_VEG"], {
    error: "Invalid food preference selected",
  }),

  tshirtSize: z.enum(["S", "M", "L", "XL", "XXL"], {
    error: "Invalid T-Shirt size selected",
  }),

  ieeeStudentBranch: z.string().optional(),
  ieeeMembershipNumber: z.string().optional(),
});

const isNullable = (value: unknown): value is null | undefined =>
  value === null || value === undefined;

const hasText = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 },
    );
  }

  const { data: profileRow, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch profile data" },
      { status: 500 },
    );
  }

  const profile = profileRow
    ? {
        username: profileRow.name,
        phone: profileRow.phone,
        college: profileRow.college,
        department: profileRow.department,
        degree: profileRow.degree,
        year: profileRow.year,
        foodPreference: profileRow.food_preference,
        tshirtSize: profileRow.tshirt_size,
        ieeeStudentBranch: profileRow.ieee_student_branch,
        ieeeMembershipNumber: profileRow.ieee_membership_no,
      }
    : null;

  const hasIeeeBranch = hasText(profileRow?.ieee_student_branch);
  const hasIeeeMembershipNo = hasText(profileRow?.ieee_membership_no);
  const ieeePairValid = hasIeeeBranch === hasIeeeMembershipNo;

  const requiredFieldsComplete =
    Boolean(profileRow) &&
    hasText(profileRow?.name) &&
    hasText(user.email) &&
    hasText(profileRow?.phone) &&
    hasText(profileRow?.college) &&
    hasText(profileRow?.department) &&
    hasText(profileRow?.degree) &&
    !isNullable(profileRow?.year) &&
    hasText(profileRow?.food_preference) &&
    hasText(profileRow?.tshirt_size);

  const isRegistrationCompleted = requiredFieldsComplete && ieeePairValid;
  const isProfileIncomplete = !isRegistrationCompleted;

  // Calculate pricing based on IEEE membership and early bird availability
  let amount = 0;
  let isEarlyBird = false;
  if (isRegistrationCompleted) {
    const isIeeeMember = Boolean(profileRow?.is_ieee_member);
    const membershipType = isIeeeMember ? 'ieee' : 'non_ieee';
    const seatLimit = EARLY_BIRD_SEAT_LIMITS[membershipType];

    // Use atomic seat counting function to prevent race conditions
    const { data: seatData, error: seatError } = await supabase
      .rpc('check_early_bird_availability', {
        p_is_ieee_member: isIeeeMember,
        p_seat_limit: seatLimit,
      });

    let usedSeats = 0;
    if (!seatError && seatData && seatData.length > 0) {
      usedSeats = seatData[0].used_seats;
      isEarlyBird = seatData[0].is_available;
    } else {
      // Fallback to regular pricing if seat check fails
      isEarlyBird = false;
    }

    // Apply pricing based on early bird availability using getPricing function
    const pricing = getPricing(membershipType, !isEarlyBird);
    amount = pricing.amount / 100; // Convert from paise to rupees
  }

  const responseBody = {
    user,
    profile,
    registration: profileRow
      ? {
          id: profileRow.id,
          status: isRegistrationCompleted
            ? "registration completed"
            : "registration pending",
        }
      : null,
    payment: {
      status: profileRow?.payment_id ? "completed" : "pending",
      amount,
      isEarlyBird,
      paymentId: profileRow?.payment_id ?? null,
    },
    isProfileIncomplete,
  };

  return NextResponse.json(responseBody);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationResult = ProfileData.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid input data",
          details: z.flattenError(validationResult.error).fieldErrors,
          // details: validationResult.error.flatten().fieldErrors, decprecated ig
        },
        { status: 400 },
      );
    }

    const validatedData = validationResult.data;

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    //doing this just in case validatedData still contains extra data altho data should be sanitized
    const {
      phone,
      college,
      department,
      degree,
      year,
      foodPreference,
      tshirtSize,
      ieeeStudentBranch,
      ieeeMembershipNumber,
    } = validatedData;
    const updatePayload = {
      phone: phone,
      college: college,
      department: department,
      degree: degree,
      year,
      food_preference: foodPreference,
      tshirt_size: tshirtSize,
      ieee_student_branch: ieeeStudentBranch,
      ieee_membership_no: ieeeMembershipNumber,
    };

    const { error: dbError } = await supabase
      .from("users")
      .update(updatePayload)
      .eq("id", user.id);

    if (dbError) {
      throw dbError;
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated",
    });
  } catch (error) {
    console.error("Complete profile error:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
