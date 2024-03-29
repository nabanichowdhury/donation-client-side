"use client";
import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../../../firebase.init";

import { getUser } from "@/lib/utils/getUser";
import { postDonate } from "@/lib/utils/postDonate";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSingleDonation } from "@/lib/utils/getSingleDonation";

const Donate = ({ params }) => {
  const router = useRouter();
  const [amount, setAmount] = useState(0);
  const [user, loading, error] = useAuthState(auth);
  if (loading) return <div>Loading...</div>;

  if (!user) {
    redirect("/login");
  }
  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const donation = await getSingleDonation(params.id);
    const currUser = await getUser(user.email);

    const u = {
      _id: currUser?._id,
      name: currUser?.name,
      email: currUser?.email,
      role: currUser?.role,
      password: currUser?.password,
      amount: amount,
    };
    const data = {
      user: u,
      donation: {
        _id: donation._id,
        name: donation.donationType,
        category: donation.category,
        amount: amount,
        description: donation.description,
        date: new Date(),
      },
    };
    const donate = await postDonate(params.id, data);
    if (donate.success) {
      showToast();
      router.push("/donations");
    }
  };
  const showToast = () => {
    toast.success("You have donated");
  };

  return (
    <div className="text-center">
      <h1 className="text-xl">Donate here:${amount}</h1>
      <input
        type="number"
        placeholder="Type here"
        className="input input-bordered w-full max-w-xs"
        value={amount < 0 ? 0 : amount}
        onChange={handleAmountChange}
      />
      <button onClick={handleSubmit} className="btn btn-primary mt-4">
        Donate
      </button>
    </div>
  );
};

export default Donate;
