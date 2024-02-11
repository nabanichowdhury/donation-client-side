"use client";
import { getUser } from "@/lib/utils/getUser";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../../../firebase.init";
import { getAllDonations } from "@/lib/utils/getAllDonations";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

const DonationStatistics = () => {
  const [userData, setUser] = useState();
  const [user, loading, error] = useAuthState(auth);
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const fetchDonations = async () => {
      const allDonations = await getAllDonations();

      setDonations(allDonations);
      if (user && !loading) {
        const u = await getUser(user?.email);
        setUser(u);
      }
    };
    fetchDonations();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  const userId = userData?._id;

  const calculateDonationsByCategory = (donations, userId) => {
    const donationsByCategory = {};
    donations.forEach((donation) => {
      const donatedByUser = donation.donatedUser.find(
        (user) => user._id === userId
      );
      if (donatedByUser) {
        const category = donation.category;
        const amount = parseInt(donatedByUser.amount);
        if (!donationsByCategory[category]) {
          donationsByCategory[category] = {
            category: category,
            donatedByUser: amount,
            donatedByOthers: 0,
          };
        } else {
          donationsByCategory[category].donatedByUser += amount;
        }
      } else {
        const category = donation.category;
        const amount = donation.donatedUser.reduce(
          (total, user) => total + parseInt(user.amount),
          0
        );
        if (!donationsByCategory[category]) {
          donationsByCategory[category] = {
            category: category,
            donatedByUser: 0,
            donatedByOthers: amount,
          };
        } else {
          donationsByCategory[category].donatedByOthers += amount;
        }
      }
    });

    // Convert the donationsByCategory object into an array of objects
    const result = Object.values(donationsByCategory);

    return result;
  };

  const donationsByCategory = calculateDonationsByCategory(donations, userId);
  console.log(donationsByCategory);
  const finalData = donationsByCategory.map((item) => {
    const totalValue = donationsByCategory.reduce(
      (acc, curr) => acc + curr.donatedByUser + curr.donatedByOthers,
      0
    );
    const percentage = (item.donatedByUser / totalValue) * 100;
    return [
      { name: item.category, value: percentage.toFixed(2) },
      { name: "others", value: (100 - percentage).toFixed(2) },
    ];
  });
  console.log(finalData);
  const calculateDonationsByType = (donations, userId) => {
    const donationsByType = {};
    donations.forEach((donation) => {
      const donatedByUser = donation.donatedUser.find(
        (user) => user._id === userId
      );
      if (donatedByUser) {
        const type = donation.donationType;
        const amount = parseInt(donatedByUser.amount);
        if (!donationsByType[type]) {
          donationsByType[type] = {
            type: type,
            donatedByUser: amount,
            donatedByOthers: 0,
          };
        } else {
          donationsByType[type].donatedByUser += amount;
        }
      } else {
        const type = donation.donationType;
        const amount = donation.donatedUser.reduce(
          (total, user) => total + parseInt(user.amount),
          0
        );
        if (!donationsByType[type]) {
          donationsByType[type] = {
            type: type,
            donatedByUser: 0,
            donatedByOthers: amount,
          };
        } else {
          donationsByType[type].donatedByOthers += amount;
        }
      }
    });

    // Convert the donationsByCategory object into an array of objects
    const result = Object.values(donationsByType);

    return result;
  };

  const donationsByType = calculateDonationsByType(donations, userId);
  console.log(donationsByCategory);
  const finalData1 = donationsByType.map((item) => {
    const totalValue = donationsByType.reduce(
      (acc, curr) => acc + curr.donatedByUser + curr.donatedByOthers,
      0
    );
    const percentage = (item.donatedByUser / totalValue) * 100;
    return [
      { name: item.type, value: percentage.toFixed(2) },
      { name: "others", value: (100 - percentage).toFixed(2) },
    ];
  });
  console.log(finalData1);
  console.log(finalData);

  const totalAmountOfUser = userData?.donations.reduce(
    (accumulator, donation) => {
      accumulator += parseInt(donation.amount);
      return accumulator;
    },
    0
  );

  const totalAmountDonated = donations.reduce((total, donation) => {
    const donationAmount = donation.donatedUser.reduce((acc, user) => {
      return acc + parseInt(user.amount);
    }, 0);

    return total + donationAmount;
  }, 0);

  console.log(totalAmountDonated);
  console.log(totalAmountOfUser);
  const data = {
    labels: ["My Total Donated Amount", "Others Donated Amount"],
    datasets: [
      {
        label: "Donation Percentage",
        data: [
          (totalAmountOfUser / totalAmountDonated) * 100,
          ((totalAmountDonated - totalAmountOfUser) / totalAmountDonated) * 100,
        ],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  return (
    <div>
      <h1 className="text-xl text-center font-bold">My donation Statistics</h1>
      <div className="w-80 mx-auto ">
        <Doughnut data={data} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h1 className="text-xl text-center font-bold">
            {" "}
            Category Wise Donation Percentage{" "}
          </h1>
          <div>
            <div className="grid grid-cols-2">
              {finalData.map((item, index) => {
                return (
                  <div key={index} className="w-64 shadow-xl my-7 ">
                    <h1 className="text-md text-center font-bold">
                      {item[0].name}
                    </h1>
                    <Doughnut
                      data={{
                        labels: [
                          "My Total Donated Amount",
                          "Others Donated Amount",
                        ],
                        datasets: [
                          {
                            label: "Donation Percentage",
                            data: [item[0].value, item[1].value],
                            backgroundColor: ["#FF6384", "#36A2EB"],
                            hoverBackgroundColor: ["#FF6384", "#36A2EB"],
                          },
                        ],
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div>
          <h1 className="text-xl text-center font-bold">
            {" "}
            Donation Type Wise Donation Percentage{" "}
          </h1>
          <div>
            <div className="grid grid-cols-2">
              {finalData1.map((item) => {
                return (
                  <div className="w-64 shadow-xl my-7 ">
                    <h1 className="text-md text-center font-bold">
                      {item[0].name}
                    </h1>
                    <Doughnut
                      data={{
                        labels: [
                          "My Total Donated Amount",
                          "Others Donated Amount",
                        ],
                        datasets: [
                          {
                            label: "Donation Percentage",
                            data: [item[0].value, item[1].value],
                            backgroundColor: ["#FF6384", "#36A2EB"],
                            hoverBackgroundColor: ["#FF6384", "#36A2EB"],
                          },
                        ],
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationStatistics;
