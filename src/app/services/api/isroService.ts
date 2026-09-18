import { supabase } from "../../../lib/supabase";

export interface IsroMission {
  name: string;
  category: string;
  description: string;
  officialPortal: string;
  source: string;
}

export interface IsroResponse<T = unknown> {
  success: boolean;
  source: string;
  type: string;
  data: T | null;
  fetchedAt?: string;
  error?: string;
}

export async function getIsroMissions(): Promise<
  IsroResponse<IsroMission[]>
> {
  try {
    const { data, error } = await supabase.functions.invoke(
      "isro-data",
      {
        body: {
          type: "missions",
        },
      },
    );

    if (error) throw error;

    if (!data?.success) {
      throw new Error(data?.error || "ISRO request failed.");
    }

    return data as IsroResponse<IsroMission[]>;
  } catch (error) {
    console.warn("ISRO request failed:", error);

    return {
      success: false,
      source: "ISRO",
      type: "missions",
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "ISRO request failed.",
    };
  }
}
