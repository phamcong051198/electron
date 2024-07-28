import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../../config/dbConnect'

interface UserAttributes {
  id?: number
  firstName?: string
  lastName?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface UserInput extends Optional<UserAttributes, 'id'> {}
export interface UserOutput extends Required<UserAttributes> {}

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
  declare id: number
  declare firstName: string
  declare lastName: string

  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

User.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    firstName: {
      allowNull: true,
      type: DataTypes.STRING
    },
    lastName: {
      allowNull: true,
      type: DataTypes.STRING
    }
  },
  {
    timestamps: true,
    sequelize,
    underscored: false
  }
)

export default User
