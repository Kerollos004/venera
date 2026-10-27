

//cases


export  interface postType {
    id?:string
    name: string,
    description?: string,
    image?: string,
    type?: string,
    likes?: number,
    user_id?: string, 
    post_likers : string[] ,
}

export interface CommentType{
    id: string, 
    comment_text: string
    comment_likes: number, 
    post_id : string,
    owner_id: string,
    comment_likers: string[]
}

export interface ProfileType {
    id: string;
    doctorName: string;
    doctorTitle?: string;
    doctorImage?: string;
    doctorBio?: string;
    doctorCertificates?: postType[];
    doctorAchievements?:postType [];
    doctorPosts?: postType[];           
    currentPlan?: string,
    current_offer?: string,
    doctorType: string
    doctorPhoneNumber: string,
    doctorEmail: string,
    is_admin?:boolean , 
    created_at : string  
}



//login and signup

export interface Logintype{
    email:string
    password: string,
}

export interface signupType{
    doctorName: string,
    doctorPhoneNumber: string,
    doctorEmail: string,
    doctorImage?: string,
    password: string,
    doctorType: string,
    doctorBio: string,
    id: string,
    doctorTitle:string
}

//payment details

export interface paymentPlan  {
    id: number, 
    name: string, 
    selected:boolean
}

export const paymentPlans: paymentPlan[] = [
    {
        id: 0, 
        name: "free",
        selected:false
    },
    {
        id: 1, 
        name: "pro",
        selected:false
    },
    {
        id: 2, 
        name: "premium",
        selected:false
    }
] 

//payment offer

export interface PaymentOffer {
    id: number,
    name: string,
    proValue: number,
    premValue:number
}

export const PaymentOffers: PaymentOffer[] = [
    {
        id: 1,
        name: " one month",
        proValue: 250,
        premValue:400
    },
    {
        id: 2,
        name: "three months",
        proValue: 500,
        premValue:800
    },
    {
        id: 3,
        name: " six months",
        proValue: 1000,
        premValue:1600
    },
    {
        id: 4,
        name: "one year",
        proValue: 2250,
        premValue:3200
    }
]

//feed backs
export interface feedBack {
    id: string, 
    feedback_owner: string,
    feedback: string,
    feedback_doctor:string
}
