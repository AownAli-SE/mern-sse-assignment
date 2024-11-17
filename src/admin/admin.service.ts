import Booking from "../bookings/booking.schema";

export class AdminService {
   async topMostRatedSellers() {
      const results = await Booking.aggregate([
         // Filter documents that have rating
         {
            $match: {
               rating: { $ne: null },
            },
         },
         //  Reference user table
         {
            $lookup: {
               from: "users",
               localField: "seller",
               foreignField: "_id",
               as: "user",
            },
         },
         //  Unwrap document from array
         {
            $unwind: "$user",
         },
         //  Group documents by sellerId and count them
         {
            $group: {
               _id: "$seller",
               firstname: { $first: "$user.firstname" },
               lastname: { $first: "$user.lastname" },
               email: { $first: "$user.email" },
               totalOrders: { $sum: 1 },
            },
         },
         //  Sorting in descending order
         {
            $sort: { count: -1 },
         },
         //  Taking top 5
         {
            $limit: 5,
         },
      ]);

      return results;
   }

   async topMostRatedListings() {
      const results = await Booking.aggregate([
         // Filter documents that have rating
         {
            $match: {
               rating: { $ne: null },
            },
         },
         //  Reference listings table
         {
            $lookup: {
               from: "listings",
               localField: "listing",
               foreignField: "_id",
               as: "details",
            },
         },
         //  //  Unwrap document from array
         {
            $unwind: "$details",
         },
         //  Group documents by listingId and count them
         {
            $group: {
               _id: "$listing",
               title: { $first: "$details.title" },
               totalBookings: { $sum: 1 },
            },
         },
         //  Sorting in descending order
         {
            $sort: { count: -1 },
         },
         //  Taking top 5
         {
            $limit: 5,
         },
      ]);

      return results;
   }

   async buyersWithMostOrders() {
      const results = await Booking.aggregate([
         //  Reference users table
         {
            $lookup: {
               from: "users",
               localField: "buyer",
               foreignField: "_id",
               as: "buyerDetails",
            },
         },
         //  //  Unwrap document from array
         {
            $unwind: "$buyerDetails",
         },
         //  Group documents by buyerId and count them
         {
            $group: {
               _id: "$buyer",
               firstname: { $first: "$buyerDetails.firstname" },
               lastname: { $first: "$buyerDetails.lastname" },
               email: { $first: "$buyerDetails.email" },
               totalOrders: { $sum: 1 },
            },
         },
         //  Sorting in descending order
         {
            $sort: { count: -1 },
         },
         //  Taking top 5
         {
            $limit: 5,
         },
      ]);

      return results;
   }

   //////////////////////
   /// Singleton pattern
   //////////////////////
   private static _instance: AdminService | null = null;
   private constructor() {}

   static getInstance() {
      if (!AdminService._instance) {
         AdminService._instance = new AdminService();
      }

      return AdminService._instance;
   }
}
