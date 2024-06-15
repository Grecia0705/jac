
export interface UserLogin {
  email: string,
  password: string,
}

export interface UserCreate extends UserLogin {
  name: string,
  lastname: string,
  username: string,
  createBy: string | null
}

export interface UserCompleted extends UserCreate {
  userId: string,

  create_at: Date,
  update_at: Date,
  delete_at: Date | null
}