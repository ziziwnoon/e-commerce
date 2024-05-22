export enum BadRequestMessege {
    InvalidLoginData = "اطلاعات ارسال شده برای ورود صحیح نمیباشد" ,
    InvalidRegisterData = "اطلاعات ارسال شده برای ثبت نام صحیح نمیباشد" ,
    InvalidDataFormat = "فرمت اطلاعات ارسال شده نمیباشد" ,
    SomethingWrong = "خطایی پیش آمده است" ,
    InvalidCategoryFormat = "فرمت دسته بندی صحیح نیست" ,
    AlreadyAccepted = "نظر انتخاب شده قبلا تایید شده است" ,
    AlreadyRejected = "نظر انتخاب شده قبلا رد شده است" ,
    AlreadyExistingTitle = "عنوان وارد شده تکراری میباشد" ,
}
export enum AuthMessege {
    NotFoundAccount = "حساب کاربری موردنظر یافت نشد" ,
    UserExistedAlready = "حساب کاربری با این مشخصات قبلا ثبت شده است",
    ExpiredOtp = "کد وارد شده منقضی شده است" ,
    TryAgain = "مجددا تلاش کنید" ,
    LogInAgain = "مجددا وارد حساب کاربری خود شوید" ,
    LogInRequired = "وارد حساب کاربری خود شوید" ,
    Blocked = "حساب کاربری شما مسدود شده است لطفا برای رفع مشکل با پشتیبانی در ارتباط باشید",
}
export enum NotFoundMessege {
    NotFoundCategory = "دسته بندی مورد نظر یافت نشد",
    NotFoundBlog = "بلاگ مورد نظر یافت نشد" ,
    NotFound = "محتوای مورد نظر یافت نشد" ,
    NotFoundUser = "کاربر مورد نظر یافت نشد" ,
}
export enum ValidationMessege {
    InvalidImageFormat = "فرمت تصویر وارد شده باید png یا jpg باشد" ,
    InvalidEmailFormat = "فرمت ایمیل وارد شده صحیح نمیباشد" ,
    InvalidPhoneFormat = "فرمت موبایل وارد شده صحیح نمیباشد" ,
}
export enum PublicMessege {
    SentOtp = "کد یکبار مصرف با موفقیت ارسال شد" ,
    LoggedIn = "با موفقیت وارد حساب کاربری خود شدید" ,
    Created = "با موفقیت ایجاد شد" ,
    Updated = "با موفقیت به روزرسانی شد" ,
    Deleted = "با موفقیت حذف شد" ,
    Inserted = "با موفقیت ایجاد شد" ,
    Liked = "با موفقیت لایک شد" ,
    Disliked = "با موفقیت لایک برداشته شد" ,
    Bookmarked = "با موفقیت ذخیره شد" ,
    Unbookmarked = "با موفقیت از لیست ذخیره برداشته شد" ,
    Followed = "با موفقیت دنبال شد" ,
    Unfollowed = "با موفقیت از لیست دنبال شوندگان برداشته شد" ,
    Blocked = "با موفقیت مسدود شد" ,
    Unblocked = "با موفقیت رفع مسدودیت شد" ,
}

export enum ConflictMessege {
    CategoryTitle = "عنوان دسته بندی وارد شده قبلا ثبت شده است" ,
    Email = "ایمیل وارد شده قبلا استفاده شده است" ,
    Phone = "تلفن وارد شده قبلا استفاده شده است" ,
    Username = "نام کاربری وارد شده قبلا استفاده شده است" ,
    
}