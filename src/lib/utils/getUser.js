export const getUser = async (email) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BE_URL}/user/${email}`, {
      cache: "no-store",
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
