export const createDonationPost = async (data) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BE_URL}/create-donation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  return result;
};
