# peopleTruffleProject

## A simply smart contract to demonstrate unit testing of a smart contract.

Initialization
> - D:\workspace\poepleTruffleProject > npm init
> - package name : (poepleTruffleProject) press ENTER until you see below question
> - Is this OK? (yes) press ENTER

Install truffle-assertions
> - D:\workspace\poepleTruffleProject > npm install truffle-assertions

How to run the test scripts : 
> - D:\workspace\poepleTruffleProject > truffle console
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
