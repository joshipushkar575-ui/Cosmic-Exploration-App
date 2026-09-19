import { getLiveISSPosition } from "./satelliteService";

export async function testISS() {
  const result = await getLiveISSPosition();
  console.log("🛰️ VYOM ISS TEST RESULT:", result);
  return result;
}
