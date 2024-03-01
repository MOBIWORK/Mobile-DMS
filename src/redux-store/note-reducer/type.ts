export type ListNoteType = {
    name:string,
    title:string,
    content:string,
    creation:Date,
    custom_checkin_id:string
}
export type ListMailType = {
    name:string,
    first_name:string,
    image:any,
    user_id:string,
    designation:string
}
export type MailReceiveParams = {
    title:string,
    content:string,
    custom_checkin_id:string,
    email:string[]
}

export type INote = {
    listNote:any[],
    listMail:any[],

}