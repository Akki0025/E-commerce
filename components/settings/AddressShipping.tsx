"use client";

import { useState } from "react";
import "../../styles/settings/AddressShipping.css";

interface Address {
  id: number;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export default function AddressShipping() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
      isDefault: true,
    },
    {
      id: 2,
      name: "Jane Doe",
      street: "456 Oak St",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      country: "USA",
      isDefault: false,
    },
  ]);

  const [newAddress, setNewAddress] = useState<Address>({
    id: Date.now(),
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    isDefault: false,
  });

  // Handle address form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  // Add new address
  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.street || !newAddress.city || !newAddress.zip) {
      alert("Please fill in all required fields.");
      return;
    }
    setAddresses([...addresses, { ...newAddress, id: Date.now() }]);
    setNewAddress({
      id: Date.now(),
      name: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      isDefault: false,
    });
  };

  // Remove an address
  const handleRemoveAddress = (id: number) => {
    setAddresses(addresses.filter((address) => address.id !== id));
  };

  // Set default address
  const handleSetDefault = (id: number) => {
    setAddresses(addresses.map((address) =>
      address.id === id ? { ...address, isDefault: true } : { ...address, isDefault: false }
    ));
  };

  return (
    <div className="settings-details">
      <h3>Saved Addresses</h3>
      {addresses.length > 0 ? (
        addresses.map((address) => (
          <div key={address.id} className={`address-box ${address.isDefault ? "default" : ""}`}>
            <p><strong>{address.name}</strong></p>
            <p>{address.street}, {address.city}, {address.state} {address.zip}</p>
            <p>{address.country}</p>
            <div className="address-actions">
              {!address.isDefault && (
                <button onClick={() => handleSetDefault(address.id)}>Set as Default</button>
              )}
              <button onClick={() => handleRemoveAddress(address.id)} className="delete-btn">Remove</button>
            </div>
          </div>
        ))
      ) : (
        <p>No addresses added yet.</p>
      )}

      <hr />

      <h3>Add New Address</h3>
      <div className="address-form">
        <input type="text" name="name" placeholder="Full Name" value={newAddress.name} onChange={handleChange} />
        <input type="text" name="street" placeholder="Street Address" value={newAddress.street} onChange={handleChange} />
        <input type="text" name="city" placeholder="City" value={newAddress.city} onChange={handleChange} />
        <input type="text" name="state" placeholder="State" value={newAddress.state} onChange={handleChange} />
        <input type="text" name="zip" placeholder="ZIP Code" value={newAddress.zip} onChange={handleChange} />
        <input type="text" name="country" placeholder="Country" value={newAddress.country} onChange={handleChange} />
        <button onClick={handleAddAddress}>Add Address</button>
      </div>
    </div>
  );
}
