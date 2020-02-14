import { Table, Column, DataType, Model, PrimaryKey, CreatedAt, UpdatedAt } from "sequelize-typescript";

@Table
export class User extends Model<User> {
    @PrimaryKey
    @Column({
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
        type: DataType.UUID
    })
    public id: string;

    @Column
    public email!: string;

    @Column
    public password!: string;

    @Column
    @CreatedAt
    public createdAt: Date = new Date();

    @Column
    @UpdatedAt
    public updatedAt: Date = new Date();

    short() {
        return {
            email: this.email
        }
    }

    toJson() {
        return {
            id: this.id,
            email: this.email
        }
    }
}