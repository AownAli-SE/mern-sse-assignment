import { throwGraphQLError } from "../utilities/helperMethods";
import { WriteListingDto } from "./dtos/writeListing.dto";
import Listing from "./listing.schema";

export class ListingService {
   async getAllListings(sellerId?: string) {
      const results = sellerId ? await Listing.find({ seller: sellerId }) : await Listing.find();
      return results;
   }

   async getListingById(id: string) {
      return await Listing.findById(id);
   }

   async addListing(addListingDto: WriteListingDto, sellerId: string) {
      const payload = { ...addListingDto.body, seller: sellerId };
      return await Listing.create(payload);
   }

   async updateListingById(id: string, updateListingDto: WriteListingDto) {
      return await Listing.findByIdAndUpdate(id, updateListingDto.body, { runValidators: true, new: true });
   }

   async deleteListingById(id: string) {
      const deleteRecord = await Listing.findByIdAndDelete(id);
      if (!deleteRecord) {
         throwGraphQLError("Document doesn't exist", "BAD_REQUEST", 400);
      }

      return { message: "Listing deleted successfully!" };
   }

   //////////////////////
   /// Singleton pattern
   //////////////////////
   private static _instance: ListingService | null = null;
   private constructor() {}

   static getInstance() {
      if (!ListingService._instance) {
         ListingService._instance = new ListingService();
      }

      return ListingService._instance;
   }
}
