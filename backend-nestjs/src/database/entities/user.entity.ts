import { Entity, Column, OneToMany, Index } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from './base.entity';
import { Address } from './address.entity';

export enum UserRole {
  CUSTOMER = 'customer',
  STAFF = 'staff',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

@Entity('users')
@Index(['email'])
@Index(['username'])
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ name: 'password_hash' })
  @Exclude()
  passwordHash: string;

  @Column({ name: 'first_name', nullable: true })
  firstName: string;

  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ name: 'email_verified_at', nullable: true })
  emailVerifiedAt: Date;

  @Column({ name: 'verification_token', nullable: true })
  @Exclude()
  verificationToken: string;

  @Column({ name: 'reset_token', nullable: true })
  @Exclude()
  resetToken: string;

  @Column({ name: 'reset_token_expires_at', nullable: true })
  resetTokenExpiresAt: Date;

  @Column({ name: 'last_login_at', nullable: true })
  lastLoginAt: Date;

  @Column({ name: 'last_login_ip', nullable: true })
  lastLoginIp: string;

  // Relationships
  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  // Virtual properties
  get fullName(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    }
    return this.username || this.email;
  }

  get isStaff(): boolean {
    return [UserRole.STAFF, UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(this.role);
  }

  get isAdmin(): boolean {
    return [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(this.role);
  }
}

