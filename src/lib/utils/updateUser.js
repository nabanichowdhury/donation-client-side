export const updateUser = async (id, user) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BE_URL}/update-user/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
