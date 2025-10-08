import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

export enum AddressType {
  SHIPPING = 'shipping',
  BILLING = 'billing',
}

@Entity('addresses')
@Index(['userId'])
export class Address extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: number;

  @Column({
    name: 'address_type',
    type: 'enum',
    enum: AddressType,
    default: AddressType.SHIPPING,
  })
  addressType: AddressType;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column()
  phone: string;

  @Column({ name: 'address_line1' })
  addressLine1: string;

  @Column({ name: 'address_line2', nullable: true })
  addressLine2: string;

  @Column({ nullable: true })
  ward: string; // Phường/Xã

  @Column()
  district: string; // Quận/Huyện

  @Column()
  city: string; // Tỉnh/Thành phố

  @Column({ name: 'postal_code', nullable: true })
  postalCode: string;

  @Column({ default: 'VN' })
  country: string; // ISO country code

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;

  // Relationships
  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Virtual property
  get fullAddress(): string {
    const parts = [this.addressLine1];
    if (this.addressLine2) parts.push(this.addressLine2);
    if (this.ward) parts.push(this.ward);
    parts.push(this.district, this.city);
    return parts.join(', ');
  }
}

