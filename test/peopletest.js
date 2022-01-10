const People        = artifacts.require("People");
const truffleAssert = require("truffle-assertions");
/* 
    - D:\workspace\poepleTruffleProject > npm init
	- package name : (poepleTruffleProject) press ENTER until you see below question
	- Is this OK? (yes) press ENTER
	- D:\workspace\poepleTruffleProject > npm install truffle-assertions
    - After making changes of the test script below, continue the following:
    - D:\workspace\poepleTruffleProject > truffle console
    - truffle(development) > migrate --reset
    - truffle(development) > test or truffle test


    Given Test Case1: 
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
   
    In my own words, we are expecting the parameters we passed into fails() MUST fail !!!    

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

 */
      contract("People", async function(accounts){

            // let instance;

            // beforeEach(async function(){
            //    instance = await People.new
            // })

        it("should not create a person with age over 150 years", async function(){

            // testing createPerson()
            let instance = await People.deployed();
            // since we are sending age=200, we are expecting this to fail 
            // the rules in createPerson is require(age < 150)
            // If this did not fail, then something wrong 
            // This test will pass if the contract fails
            // instead of sending 1 ether in wei(18 zeros) unit like this {value: 1000000000000000000... we use web3.utils to send ether
            // in our test, we will pass ===> require(msg.value >= 1 ether);
            
            // await truffleAssert.fails(instance.createPerson("Jojo", 200, 190, {value: web3.utils.toWei("1", "ether")}));
           
            await truffleAssert.fails(instance.createPerson("Jojo", 200, 190, {value: web3.utils.toWei("1", "ether")}), truffleAssert.ErrorType.REVERT);
        });  
        
        it("should not create a person without payment", async function(){
            // testing createPerson()
            let instance = await People.deployed();            
            await truffleAssert.fails(instance.createPerson("Jojo", 50, 190, {value: 1000}), truffleAssert.ErrorType.REVERT);
        });

        it("should set senior status correctly", async function(){
            // testing createPerson()
            let instance = await People.deployed();            
            await instance.createPerson("Jojo", 65, 190, {value: web3.utils.toWei("1", "ether")});
            let result = await instance.getPerson();
            assert(result.senior === true, "Senior level not set");
        });  
                    
            /* 
                Contract: People
                √ should not create a person with age over 150 years (1318ms)
                √ should not create a person without payment (415ms)
                √ should set senior status correctly (1430ms)
            
            */

        // testing the one created before on createPerson()
        it("should set age correctly", async function(){
            let instance = await People.deployed();            
            let result = await instance.getPerson();
            assert(result.age.toNumber() === 65, "Age is not set correctly");
        });  

        // OR you can combine them all :
        //  it("should set all people properties correctly", async function(){
        // assert(result.senior === true && result.age.toNumber() === 65, "Properties are not set");    



        it("should not allow non-owner to delete people", async function(){
            // testing createPerson()
            let instance = await People.deployed();    
            
            // the accounts[0] is used for the deployment. The accounts[0] is the one on top of the list of account from Ganache
            // So in this case, we use the second account
            await instance.createPerson("Lisa", 35, 160, {from: accounts[1], value: web3.utils.toWei("1", "ether")});
            // should failed but must REVERT and you won't see the error mentioned in "Results Case2"
            // we want this to fail because account 1 is not allowed to delete a person
            await truffleAssert.fails(instance.deletePerson(accounts[1], {from: accounts[1]}), truffleAssert.ErrorType.REVERT);
        });  
        // as you noticed, we don't need to create another person here(but if you want a new one apply People.new(), see below) 
        // because the contract's state is intact but the danger here is that if truffleAssert.fails() (see Results Case2), 
        // the following will not be performed. 
        
        it("should allow the owner to delete people", async function(){
            let instance = await People.deployed();    
            // here we are deleting the same person(accounts[1]) created from the previous test  by the owner accounts[0]
            await truffleAssert.passes(instance.deletePerson(accounts[1], {from: accounts[0]}));
        });  

        it("should allow the owner to delete people", async function(){
           // But if you need a fresh state of the contract like testing initial state multiple times
           let instance = await People.new();    
           // and create a new Person again
           await instance.createPerson("Lisa", 35, 160, {from: accounts[1], value: web3.utils.toWei("1", "ether")}); 
           await truffleAssert.passes(instance.deletePerson(accounts[1], {from: accounts[0]}));
           // the other way to do this of having a new instance of every test :
           
           // let instance;

           // beforeEach(async function(){
           //    instance = await People.new
           // })
           // remove all functions with " let instance = await People.deployed();"
           
        });
                
        it("should add balance correctly after createPerson call with 1 ether", async function(){
            let instance = await People.new();
            await instance.createPerson("Lisa", 35, 160, {from: accounts[2], value: web3.utils.toWei("1", "ether")});

            let balance = await instance.balance();
            let floatBalance = parseFloat(balance);

            let realBalance = await web3.eth.getBalance(instance.address);

            assert(floatBalance == web3.utils.toWei("1", "ether") && floatBalance == realBalance)
        });

        // passes()    
        it("should allow the owner to withdraw balance", async function(){
            let instance = await People.new();
            await instance.createPerson("Lisa", 35, 160, {from: accounts[2], value: web3.utils.toWei("1", "ether")});
            await truffleAssert.passes(instance.withdrawAll({from: accounts[0]})); // explicitly get from 1st account but dont have to do this
        });

        // fails(), expecting this to fail AND will REVERT
        it("should not allow the non-owner to withdraw balance", async function(){
            let instance = await People.new();
            await instance.createPerson("Lisa", 35, 160, {from: accounts[2], value: web3.utils.toWei("1", "ether")});
            await truffleAssert.fails(instance.withdrawAll({from: accounts[2]}), truffleAssert.ErrorType.REVERT);
        });

        // the balance increases after the withdraw
        it("owners balance should increase after withdrawal", async function(){
            let instance = await People.new();
            await instance.createPerson("Lisa", 35, 160, {from: accounts[2], value: web3.utils.toWei("1", "ether")});

            // get the balance before withdrawing them
            // use parseFloat() to get web3.eth.getBalance
            let balanceBefore = parseFloat(await web3.eth.getBalance(accounts[0])); 
            await instance.withdrawAll();
             // get the balance after withdrawing them
            let balanceAfter = parseFloat(await web3.eth.getBalance(accounts[0]));
            assert(balanceBefore < balanceAfter, "Owners balance was not increased after withdrawal");
        });

        it("should reset balance to 0 after withdrawal", async function(){
            let instance = await People.new();
            await instance.createPerson("Lisa", 35, 160, {from: accounts[2], value: web3.utils.toWei("1", "ether")});

            await instance.withdrawAll();

            // get the variable balance of the contract
            let balance = await instance.balance();
            let floatBalance = parseFloat(balance);

            // get the real balance in the blockchain of the contract 
            let realBalance = await web3.eth.getBalance(instance.address);

            // convert to 0 ether to Wei bec the variable balance will be in Wei
            assert(floatBalance == web3.utils.toWei("0", "ether") && floatBalance == realBalance, "Contract balance was not 0 after withdrawal or did not match")

        });




 /*      Contract: People
      √ should not create a person with age over 150 years (1162ms)
      √ should not create a person without payment (404ms)
      √ should set senior status correctly (1318ms)
      √ should set age correctly (158ms)
      √ should not allow non-owner to delete people (1495ms)
      √ should allow the owner to delete people (706ms) */

    });