interface Preference {
    _id?: string;
    categoryName?: string;
  }
  
  export interface UserProfile {
    userId?:string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    dob?: string;
    preferences?: Preference[];
  }
  

  export interface ArticleFormData {
    articleName: string;
    description: string;
    tags: string[]; // Since tags are joined with ",", the original type is an array
    category: string; // Assuming category ID is a string
    image?: File; // Optional because it's only appended if available
    userId?: string; // Optional because it's only appended if available
  }
  