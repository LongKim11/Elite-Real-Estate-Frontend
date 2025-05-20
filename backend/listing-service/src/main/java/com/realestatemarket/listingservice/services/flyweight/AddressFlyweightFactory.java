package com.realestatemarket.listingservice.services.flyweight;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import com.realestatemarket.listingservice.entity.Address;
import com.realestatemarket.listingservice.repository.AddressRepository;

@Component
public class AddressFlyweightFactory {

    // @Autowired
    // private RedisTemplate<String, Address> redisTemplate;

    @Autowired
    private AddressRepository addressRepository;

    // Tạo key cho Redis từ ward, town, province
    private String generateKey(String ward, String town, String province) {
        return "address:" + ward + "_" + town + "_" + province;
    }

    public Address getAddress(String ward, String town, String province) {
        String key = generateKey(ward, town, province);

        // 1. Check in Redis cache
        // Address cachedAddress = redisTemplate.opsForValue().get(key);
        // if (cachedAddress != null) {
        //     System.out.println("Address found in cache: " + cachedAddress);
        //     return cachedAddress;
        // }

        System.out.println("Address not found trong cache: " + key);
        
        // 2. Check in database
        String addressId = ward + "_" + town + "_" + province;
        Optional<Address> existingAddress = addressRepository.findByAddressId(addressId);
        if (existingAddress.isPresent()) {
            // redisTemplate.opsForValue().set(key, existingAddress.get()); 
            return existingAddress.get();
        }

        // 3. Not found in cache or database, create a new Address
        Address newAddress = new Address();
        newAddress.setWard(ward);
        newAddress.setTown(town);
        newAddress.setProvince(province);
        newAddress.setAddressId(addressId); 
        Address saved = addressRepository.save(newAddress);

        // 4. Cache the new Address in Redis
        // redisTemplate.opsForValue().set(key, saved);

        return saved;
    }
}
