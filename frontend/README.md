# KhyberFarm Frontend
After deployment, the list of requisite addresses will be logged into your terminal. Copy `.json` files of the contracts artifacts under `artifacts/contracts` to the frontend/src/abis folder then copy the addresses of the contracts towards the end of the json abi. They will look like this:
```
{
    "deployedLinkReferences": {},
    //add the "networks" section in all the contract abis json
    "networks": {
        "42": {
            "address": "0x..."
        }
    }
}
```
***
Inside the khyber-farm/frontend directory:
```
npm i
```
before finally:
```
npm run start
```
