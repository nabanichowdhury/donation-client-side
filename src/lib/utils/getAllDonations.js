export const getAllDonations = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BE_URL}/donations`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data;
};
