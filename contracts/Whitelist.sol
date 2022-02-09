// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.4;

contract Whitelist {
    uint8 public maxWhitelistAddresses;

    mapping(address => bool) public whitelistedAddresses;

    uint8 numOfAddressesWhitelisted;

    constructor(uint8 _maxWhitelistedAddresses){
        maxWhitelistAddresses = _maxWhitelistedAddresses;
    }

    function addAddressTowhitelist() public {
        require(!whitelistedAddresses[msg.sender], 'Sender has already been registered');
        require(numOfAddressesWhitelisted < maxWhitelistAddresses, 'Whitelist limit reached');

        whitelistedAddresses[msg.sender] = true;

        numOfAddressesWhitelisted +=1;
    }
}