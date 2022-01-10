# peopleTruffleProject

## A simply smart contract to demonstrate unit testing of a smart contract.

Initialization
> - D:\workspace\poepleTruffleProject > npm init
> - package name : (peopleTruffleProject) press ENTER until you see below question
> - Is this OK? (yes) press ENTER

Install truffle-assertions
> - D:\workspace\poepleTruffleProject > npm install truffle-assertions

How to run the test scripts : 
> - D:\workspace\peopleTruffleProject > truffle console
> - truffle(development) > migrate --reset
> - truffle(development) > test or truffle test


Given Test Case1: 
```
  require(age < 150)
  we send age = 200

  Script:     
  it("should not create a person with age over 150 years", async function(){
      let instance = await People.deployed();
      await truffleAssert.fails(instance.createPerson("Jojo", 200, 190, {value: web3.utils.toWei("1", "ether")}));
  });  


  Results Case1: 
      Contract: People
      √ should not create a person with age over 150 years (1058ms)

  In my own words, we are expecting the parameters we passed into fails() that it MUST fail !!!    
```
Given Test Case2: 
```
    Now try to change "require(age < 150)" to "require(age > 150)"
    - truffle(development) > migrate --reset
    - truffle(development) > test or truffle test

    Results Case2:
        AssertionError: Did not fail 

        So what this means is that "truffleAssert.fails" did not fail because the age we are sending is 200
        which satisfies the condition "require(age > 150)" 
        The contract did not fail but the test failed. It means, something wrong in the contract's logic.


        To see what specific type of error the test is throwing, add error type. In this case, I added REVERT:
            await truffleAssert.fails(instance.createPerson("Jojo", 200, 190, {value: web3.utils.toWei("1", "ether")}), truffleAssert.ErrorType.REVERT);

        when you add the error type and run it again, you will get same result as "Results Case1" because it has REVERTed(satisfies the type) it instead of getting the error from "Results Case2"
            - truffle(development) > migrate --reset
            - truffle(development) > test or truffle test       
```

Migrate (run from the terminal and make sure your Ganache is open) :
> - D:\blockchain\peopleTruffleProject> truffle console (only if you are not in the console yet)
> - truffle(development)> migrate --reset (only use migrate if this is your first time) 
 

      Compiling your contracts...
      ===========================
      > Compiling .\contracts\Migrations.sol
      > Compiling .\contracts\Ownable.sol
      > Compiling .\contracts\People.sol
      > Artifacts written to D:\blockchain\peopleTruffleProject\build\contracts
      > Compiled successfully using:
         - solc: 0.8.10+commit.fc410830.Emscripten.clang

      Starting migrations...
      ======================
      > Network name:    'development'
      > Network id:      5777
      > Block gas limit: 6721975 (0x6691b7)


      1_initial_migration.js
      ======================

         Replacing 'Migrations'
         ----------------------
         > transaction hash:    0x86366af067fe088640de81041e8f42f9885301c5b5b8a2cd9651545b314b89a5
         > Blocks: 0            Seconds: 0
         > contract address:    0x4C07AFe23EC80cD45E9Fddc0990EE7024afB3D1E
         > block number:        249
         > block timestamp:     1641810834
         > account:             0x949CE02E352E9Ed86AdcCeC797474Efaf6034e91
         > balance:             93.868237239987
         > gas used:            248854 (0x3cc16)
         > gas price:           20 gwei
         > value sent:          0 ETH
         > total cost:          0.00497708 ETH


         > Saving migration to chain.
         > Saving artifacts
         -------------------------------------
         > Total cost:          0.00497708 ETH


      2_people_migration.js
      =====================

         Replacing 'People'
         ------------------
         > transaction hash:    0x30698200d690c97cacf49b084ed978f9066ff4441507c5ec0a9f24cee2b244b2
         > Blocks: 0            Seconds: 0
         > contract address:    0x48bC239F494199ee182b8320C697a33d85C5A2d5
         > block number:        251
         > block timestamp:     1641810836
         > account:             0x949CE02E352E9Ed86AdcCeC797474Efaf6034e91
         > balance:             93.843257219987
         > gas used:            1206488 (0x1268d8)
         > gas price:           20 gwei
         > value sent:          0 ETH
         > total cost:          0.02412976 ETH


         > Saving migration to chain.
         > Saving artifacts
         -------------------------------------
         > Total cost:          0.02412976 ETH


      Summary
      =======
      > Total deployments:   2
      > Final cost:          0.02910684 ETH


      - Blocks: 0            Seconds: 0
      - Saving migration to chain.
      - Blocks: 0            Seconds: 0
      - Saving migration to chain.

Test :
>    truffle(development)> test
    Using network 'development'.


    Compiling your contracts...
    ===========================
    > Compiling .\contracts\Migrations.sol
    > Compiling .\contracts\Ownable.sol
    > Compiling .\contracts\People.sol
    > Artifacts written to C:\Users\jojop\AppData\Local\Temp\test--29708-7BaLiqosFTSy
    > Compiled successfully using:
       - solc: 0.8.10+commit.fc410830.Emscripten.clang



      Contract: People
        √ should not create a person with age over 150 years (1229ms)
        √ should not create a person without payment (402ms)
        √ should set senior status correctly (1188ms)
        √ should set age correctly (175ms)
        √ should not allow non-owner to delete people (1283ms)
        √ should allow the owner to delete people (727ms)
        √ should allow the owner to delete people (2105ms)
        √ should add balance correctly after createPerson call with 1 ether (1467ms)
        √ should allow the owner to withdraw balance (1937ms)
        √ should not allow the non-owner to withdraw balance (1621ms)
        √ owners balance should increase after withdrawal (1843ms)
        √ should reset balance to 0 after withdrawal (2103ms)


      12 passing (16s)


    truffle(development)>
