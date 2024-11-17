import { throwGraphQLError } from "../utilities/helperMethods";
import { ContextType } from "../utilities/types/context";
import { AdminService } from "./admin.service";

const adminService = AdminService.getInstance();

export const resolver = {
   Query: {
      topRatedSellers: async (_: undefined, __: Record<never, never>, ctx: ContextType) => {
         if (!ctx.user || !ctx.user.isAdmin) {
            throwGraphQLError("Request denied", "FORBIDDEN", 403);
         }

         const result = await adminService.topMostRatedSellers();
         return result;
      },

      topRatedListings: async (_: undefined, __: Record<never, never>, ctx: ContextType) => {
         if (!ctx.user || !ctx.user.isAdmin) {
            throwGraphQLError("Request denied", "FORBIDDEN", 403);
         }

         const result = await adminService.topMostRatedListings();
         return result;
      },

      topBuyersWithMostOrders: async (_: undefined, __: Record<never, never>, ctx: ContextType) => {
         if (!ctx.user || !ctx.user.isAdmin) {
            throwGraphQLError("Request denied", "FORBIDDEN", 403);
         }

         const result = await adminService.buyersWithMostOrders();
         return result;
      },
   },
};
