import Booking from "./booking.schema";
import { throwGraphQLError } from "../utilities/helperMethods";
import { ListingService } from "../listings/listing.service";

export class BookingService {
   listingService = ListingService.getInstance();

   async createOrder(listingId: string, buyerId: string) {
      // Checking if buyer and seller are same
      const listing = await this.listingService.getListingById(listingId);
      if (!listing || listing.seller.toString() === buyerId.toString()) {
         throwGraphQLError("Invalid order request", "FORBIDDEN", 403);
      }

      // Creating order
      const payload = { listing: listingId, seller: listing.seller, buyer: buyerId };
      const order = await Booking.create(payload);
      return order;
   }

   async getOrderById(orderId: string, userId: string, userType: "buyer" | "seller") {
      const filter = { _id: orderId };
      if (userType === "seller") filter["seller"] = userId;
      if (userType === "buyer") filter["buyer"] = userId;

      const order = await Booking.findOne(filter);
      return order;
   }

   async getBuyerOrders(buyerId: string) {
      const orders = await Booking.find({ buyer: buyerId });
      return orders;
   }

   async getSellerOrders(sellerId: string) {
      const orders = await Booking.find({ seller: sellerId });
      return orders;
   }

   async completeOrder(orderId: string, buyerId: string) {
      const order = await Booking.findById(orderId);
      if (!order) {
         throwGraphQLError(`Order with ID ${orderId} doesn't exist`, "BAD_REQUEST", 400);
      }

      if (buyerId.toString() !== order.buyer.toString()) {
         throwGraphQLError("Invalid completion request.", "FORBIDDEN", 403);
      }

      order.isCompleted = true;
      order.status = "Completed";

      await order.save();

      return { message: "Order marked completed." };
   }

   async cancelOrder(orderId: string, buyerId: string) {
      const order = await Booking.findById(orderId);
      if (!order) {
         throwGraphQLError(`Order with ID ${orderId} doesn't exist`, "BAD_REQUEST", 400);
      }

      if (buyerId.toString() !== order.buyer.toString()) {
         throwGraphQLError("Invalid completion request", "FORBIDDEN", 403);
      }

      order.status = "Cancelled";
      await order.save();

      return { message: "Order marked cancelled." };
   }

   async rateOrder(orderId: string, rating: number, comments: string, buyerId: string) {
      const order = await Booking.findById(orderId);
      if (!order) {
         throwGraphQLError(`Order with ID ${orderId} doesn't exist`, "BAD_REQUEST", 400);
      }

      if (buyerId.toString() !== order.buyer.toString()) {
         throwGraphQLError("Invalid completion request", "FORBIDDEN", 403);
      }

      order.rating = rating;
      order.comments = comments;
      await order.save();

      return { message: "Order was rated" };
   }

   //////////////////////
   /// Singleton pattern
   //////////////////////
   private static _instance: BookingService | null = null;
   private constructor() {}

   static getInstance() {
      if (!BookingService._instance) {
         BookingService._instance = new BookingService();
      }

      return BookingService._instance;
   }
}
