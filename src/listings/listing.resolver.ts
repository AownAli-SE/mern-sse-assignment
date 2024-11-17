import { UserService } from "../users/users.service";
import { throwGraphQLError } from "../utilities/helperMethods";
import { ContextType } from "../utilities/types/context";
import { ReadListing } from "./dtos/readListing.dto";
import { WriteListingDto } from "./dtos/writeListing.dto";
import { ListingService } from "./listing.service";

const listingService = ListingService.getInstance();
const userService = UserService.getInstance();

export const resolver = {
   Query: {
      listings: (_: undefined, __: Record<string, any>, ctx: ContextType) => {
         if (!ctx.user) {
            throwGraphQLError("Unauthorized", "UNAUTHORIZED", 401);
         }

         return listingService.getAllListings();
      },

      listing: (_: undefined, args: { id: string }, ctx: ContextType) => {
         if (!ctx.user) {
            throwGraphQLError("Unauthorized", "UNAUTHORIZED", 401);
         }

         return listingService.getListingById(args.id);
      },
   },

   Listing: {
      seller: (parent: ReadListing, _: Record<string, any>, ctx: ContextType) => {
         if (!ctx.user) {
            throwGraphQLError("Unauthorized", "UNAUTHORIZED", 401);
         }

         return userService.getUserById(parent.seller.toString());
      },
   },

   Mutation: {
      addListing: (_: undefined, args: WriteListingDto, ctx: ContextType) => {
         if (!ctx.user) {
            throwGraphQLError("Unauthorized", "UNAUTHORIZED", 401);
         } else if (ctx.user.role !== "seller") {
            throwGraphQLError("Request denied", "FORBIDDEN", 403);
         }

         return listingService.addListing(args, ctx.user.id);
      },

      updateListing: (_: undefined, args: WriteListingDto, ctx: ContextType) => {
         if (!ctx.user) {
            throwGraphQLError("Unauthorized", "UNAUTHORIZED", 401);
         } else if (ctx.user.role !== "seller") {
            throwGraphQLError("Request denied", "FORBIDDEN", 403);
         }

         return listingService.updateListingById(args.id, args);
      },

      deleteListing: (_: undefined, args: { id: string }, ctx: ContextType) => {
         if (!ctx.user) {
            throwGraphQLError("Unauthorized", "UNAUTHORIZED", 401);
         } else if (ctx.user.role !== "seller") {
            throwGraphQLError("Request denied", "FORBIDDEN", 403);
         }

         return listingService.deleteListingById(args.id);
      },
   },
};
