import { ListingService } from "../listings/listing.service";
import { UserService } from "../users/users.service";
import { throwGraphQLError } from "../utilities/helperMethods";
import { ContextType } from "../utilities/types/context";
import { BookingService } from "./booking.service";
import { OrderDto } from "./dtos/order.dto";

const bookingService = BookingService.getInstance();
const userService = UserService.getInstance();
const listingService = ListingService.getInstance();

export const resolver = {
   Query: {
      sellerOrders: (_: undefined, args: Record<never, never>, ctx: ContextType) => {
         if (!ctx.user) {
            throwGraphQLError("Unauthorized", "UNAUTHORIZED", 401);
         } else if (ctx.user.role !== "seller") {
            throwGraphQLError("Request denied", "FORBIDDEN", 403);
         }

         return bookingService.getSellerOrders(ctx.user.id);
      },

      buyerOrders: (_: undefined, args: Record<never, never>, ctx: ContextType) => {
         if (!ctx.user) {
            throwGraphQLError("Unauthorized", "UNAUTHORIZED", 401);
         } else if (ctx.user.role !== "buyer") {
            throwGraphQLError("Request denied", "FORBIDDEN", 403);
         }

         return bookingService.getBuyerOrders(ctx.user.id);
      },

      order: (_: undefined, args: { orderId: string }, ctx: ContextType) => {
         if (!ctx.user) {
            throwGraphQLError("Unauthorized", "UNAUTHORIZED", 401);
         }

         return bookingService.getOrderById(args.orderId, ctx.user.id, ctx.user.role as "buyer" | "seller");
      },
   },

   Order: {
      seller: (parent: OrderDto, args, ctx: ContextType) => {
         if (!ctx.user) {
            throwGraphQLError("Unauthorized", "UNAUTHORIZED", 401);
         }

         return userService.getUserById(parent.seller);
      },

      buyer: (parent: OrderDto, args, ctx: ContextType) => {
         if (!ctx.user) {
            throwGraphQLError("Unauthorized", "UNAUTHORIZED", 401);
         }

         return userService.getUserById(parent.buyer);
      },
      listing: (parent: OrderDto, args, ctx: ContextType) => {
         if (!ctx.user) {
            throwGraphQLError("Unauthorized", "UNAUTHORIZED", 401);
         }

         return listingService.getListingById(parent.listing);
      },
   },

   Mutation: {
      createOrder: (_: undefined, args: { listingId: string }, ctx: ContextType) => {
         if (!ctx.user) {
            throwGraphQLError("Unauthorized", "UNAUTHORIZED", 401);
         } else if (ctx.user.role !== "buyer") {
            throwGraphQLError("Request denied", "FORBIDDEN", 403);
         }

         return bookingService.createOrder(args.listingId, ctx.user.id);
      },

      completeOrder: (_: undefined, args: { orderId: string }, ctx: ContextType) => {
         if (!ctx.user) {
            throwGraphQLError("Unauthorized", "UNAUTHORIZED", 401);
         } else if (ctx.user.role !== "buyer") {
            throwGraphQLError("Request denied", "FORBIDDEN", 403);
         }

         return bookingService.completeOrder(args.orderId, ctx.user.id);
      },

      cancelOrder: (_: undefined, args: { orderId: string }, ctx: ContextType) => {
         if (!ctx.user) {
            throwGraphQLError("Unauthorized", "UNAUTHORIZED", 401);
         } else if (ctx.user.role !== "buyer") {
            throwGraphQLError("Request denied", "FORBIDDEN", 403);
         }

         return bookingService.cancelOrder(args.orderId, ctx.user.id);
      },

      rateOrder: (_: undefined, args: { orderId: string; rating: number; comments: string }, ctx: ContextType) => {
         if (!ctx.user) {
            throwGraphQLError("Unauthorized", "UNAUTHORIZED", 401);
         } else if (ctx.user.role !== "buyer") {
            throwGraphQLError("Request denied", "FORBIDDEN", 403);
         }

         return bookingService.rateOrder(args.orderId, args.rating, args.comments, ctx.user.id);
      },
   },
};
