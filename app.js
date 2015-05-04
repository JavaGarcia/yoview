var colors = require('colors');
//Settigns
var videos    = require('./videos.js'),
    //userAgent = requiere('./UA.js'),
    words     = require('./words.js');

var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    keys = require('selenium-webdriver').Key,
    until = require('selenium-webdriver').until;



var driver;
var timeFail = [0.5,1.5];
var timeReal = [1,5];
var i = 0;
var minutes = 1/2;


var watchFail = function(current,max){
  var x =  random(0,words.length-1);
  var xWord = words[x];
  driver.get('http://www.youtube.com');
  driver.wait(function(){
    return driver.isElementPresent(By.name("search_query"));
  },10000).then(function(){
    console.log("[+] Youtube... \tOK");
    console.log("[+] Search... \t("+xWord+")");
    driver.findElement(By.name('search_query')).clear();
    driver.findElement(By.name('search_query')).sendKeys(xWord+keys.RETURN).then(function(){
      driver.wait(until.titleIs(xWord +' - YouTube'), 10000).then(function(){
        console.log("[+] Show response... \tWait to select video (1-6 seconds)");
        driver.sleep(random(1000,6000)).then(function(){
          console.log("[+] Video selected... \tOk");
          driver.findElement(By.xpath("//*[@class='item-section']/li["+random(1,15)+"]/div/div/div[1]/a")).click().then(function(){
            driver.wait(function(){
              return driver.isElementPresent(By.xpath("//*[@id='watch-like']"));
            },10000).then(function(){
              var time = random(timeFail[0],timeFail[1],true)*60;
              console.log("[+] Video... \tPLAY"+" time: "+time+" seconds.");
              driver.sleep(time*1000).then(function(){
                console.log("[+] Done!");
                if((current+1)<=max){
                  console.log(watchFail((current+1),max));
                }else{
                  if(i<videos.length-1){
                    watch();
                  }
                }
              });
            });
          });
        });
      });
    });
  });
}

var watch = function(){
  var xKeyword = random(0,videos[i].keywords.length-1);
  console.log("Video \t="+videos[i].keywords[xKeyword]);
  driver.findElement(By.name('search_query')).clear();
  driver.findElement(By.name('search_query')).sendKeys(videos[i].keywords[xKeyword]+keys.RETURN).then(function(){
    driver.wait(until.titleIs(videos[i].keywords[xKeyword] +' - YouTube'), 10000).then(function(){
      console.log("[+] Show response... \t Search link");
      driver.sleep(random(1000,6000)).then(function(){
        driver.findElement(By.xpath("//a[contains(@href,'"+videos[i].link+"')]")).click().then(function(){
          console.log("[+] Cargando video");
          driver.wait(function(){
            return driver.isElementPresent(By.xpath("//*[@id='watch-like']"));
          },10000).then(function(){
            var time = random(timeReal[0],timeReal[1],true)*60;
            console.log('[+] viendo por: '+time+" segudos");
            driver.sleep(time*1000).then(function(){

              if(i<videos.length-1){
                i++;
                //run the next
                watchFail(1,random(1,4));
              }else{
                driver.quit();
              }
              console.log("Done 2!")

            });
          });
        });
      });
    });
  });
}


var random = function(min,max,float){
  if(!float){
    return Math.floor((Math.random() * max) + min);
  }else{
    return (Math.random() * max) + min;
  }
}

driver = new webdriver.Builder().forBrowser('firefox').build();
watchFail(1,2)
