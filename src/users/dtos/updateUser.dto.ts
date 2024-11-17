export type UpdateUserDto = {
   email: string;
   body: {
      firstname?: string;
      lastname?: string;
      username?: string;
   };
};
