import { userInstance } from "./axiosInstance/userAxiosInstance"

export const registerUser = async(data:{firstName:string,lastName:string,email:string,phone:string,dateOfBirth:string,password:string,confirmPassword:string})=>{
    const response = await userInstance.post("/signup",data)
    return response.data
}

export const signinUser = async(data:{email:string,password:string})=>{
    const response = await userInstance.post("/signin",data)
    return response.data
}

// export const profileInfo = async(data:any)=>{
//     const response = await userInstance.post("/get-profile-info",data)
//     return response.data
// }

   