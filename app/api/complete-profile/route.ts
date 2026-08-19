import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const CompleteProfileSchema = z.object({
  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone number should be 10 characters long"),
    // .regex(/^\+?[0-9\s-]{10,15}$/, "Invalid phone number format"),

  college: z
    .string()
    .min(2, "College name must be at least 2 characters")
    .max(100),

  department: z
    .string()
    .min(1, "Department is required"),

  year: z
    .coerce
    .number()
    .int()
    .min(1, "Year must be between 1 and 5")
    .max(5, "Year must be between 1 and 5"),

  foodPreference: z.enum(["VEG", "NON_VEG"], {
    error: "Invalid food preference selected",
  }),

  tShirtSize: z.enum(["XS", "S", "M", "L", "XL", "XXL"], {
    error: "Invalid T-Shirt size selected",
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    

    const validationResult = CompleteProfileSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid input data",
          details: z.flattenError(validationResult.error).fieldErrors
          // details: validationResult.error.flatten().fieldErrors, decprecated ig
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    const supabase = await createClient();
    const supabaseAdmin = await createAdminClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    //doing this just in case validatedData still contains extra data altho data should be sanitized 
    const { phone, college, department, year, foodPreference, tShirtSize } = validatedData;
    const updatePayload = { phone: phone, college: college, department: department, year, food_preference: foodPreference, tshirt_size: tShirtSize };

    const { error: dbError } = await supabaseAdmin
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
        error:
          error instanceof Error
            ? error.message
            : "Internal server error",
      },
      { status: 500 }
    );
  }
}