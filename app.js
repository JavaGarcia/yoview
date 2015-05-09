var videos    = require('./videos.js'),
    userAgent = require('./userAgent.js'),
    words     = require('./words.js');

var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    keys = require('selenium-webdriver').Key,
    proxy = require('selenium-webdriver/proxy'),
    until = require('selenium-webdriver').until;



var driver;
var i = 0;
/* ---CONFIG--- */
//proxy http
var proxyIP   = "",
    proxyPort = "";
//Limits of random number between [a,b]
var timeFail = [0.5,1.5], //Time for video Fail playback (minutes)
    timeReal = [1,5],     //Time for video Real playback (minutes)
    timeWait = [1,6],     //Timeout after video search (seconds)
    nxFail   = [1,5];     //How many videos fail search?
/* END CONFIG */

var watchFail = function(current,max){
  var x =  random(0,words.length-1);
  var xWord = words[x].trim();
  console.log("[!] Video fail "+current+"/"+max);
  //add later other method (return or random way to search) //next version
  driver.get('http://www.youtube.com');
  try {
    	driver.wait(function(){
        return driver.isElementPresent(By.name("search_query"));
      },10000).then(function(){
      console.log("[+] Youtube... \tOK");
      console.log("[+] Search... \t("+xWord+")");
      driver.findElement(By.name('search_query')).clear();
      driver.findElement(By.name('search_query')).sendKeys(xWord+keys.RETURN).then(function(){
        driver.wait(until.titleIs(xWord +' - YouTube'), 10000).then(function(){
          console.log("[+] Show response...");
          driver.sleep(random(timeWait[0]*1000,timeWait[1]*1000)).then(function(){
            console.log("[+] Video selected... \tOk");
            driver.findElement(By.xpath("//*[@class='item-section']/li["+random(1,15)+"]/div/div/div[1]/a")).click().then(function(){
              driver.wait(function(){
                return driver.isElementPresent(By.xpath("//*[@id='watch-like']"));
              },10000).then(function(){
                var time = random(timeFail[0],timeFail[1],true)*60;
                console.log("[>] Video... \tPLAY"+" time: "+time+" seconds.");
                driver.sleep(time*1000).then(function(){
                  console.log("[x] Done!");
                  if((current+1)<=max){
                    watchFail((current+1),max);
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
  }catch(e){
    console.log(e);
    watchFail((current),max);
  }
}

var watch = function(){
  var xKeyword = random(0,videos[i].keywords.length-1);
  console.log("[+] Search Video by keyword \t= "+videos[i].keywords[xKeyword]);
  driver.findElement(By.name('search_query')).clear();
  driver.findElement(By.name('search_query')).sendKeys(videos[i].keywords[xKeyword].trim()+keys.RETURN).then(function(){
    driver.wait(until.titleIs(videos[i].keywords[xKeyword].trim() +' - YouTube'), 10000).then(function(){
      console.log("[+] Show response... \t and search link");
      driver.sleep(random(1000,6000)).then(function(){
        driver.findElement(By.xpath("//a[contains(@href,'"+videos[i].link+"')]")).click().then(function(){
          console.log("[+] Loading video");
          driver.wait(function(){
            return driver.isElementPresent(By.xpath("//*[@id='watch-like']"));
          },10000).then(function(){
            var time = random(timeReal[0],timeReal[1],true)*60;
            console.log("[>] Video... \tPLAY"+" time: "+time+" seconds.");
            driver.sleep(time*1000).then(function(){
              if(i<videos.length-1){
                i++;
                //run the next 
                watchFail(1,random(1,4));
                console.log("------Next------");
              }else{
                driver.quit();
                console.log("------END------");
              }
            });
          });
        });
      });
    });
  });
};

var random = function(min,max,float){
  if(float){
    return (Math.random() * max) + min;
  }else{
    return Math.floor((Math.random() * max) + min);
  }
};

var firefox = require('selenium-webdriver/firefox');
var profile = new firefox.Profile();
var xUA = random(0,userAgent.length-1)
console.log("Open browser using "+userAgent[xUA]);
profile.setPreference("general.useragent.override", userAgent[xUA]);
profile.setPreference('browser.cache.disk.enable', false);
profile.setPreference('browser.cache.memory.enable', false);
profile.setPreference('browser.cache.offline.enable', false);
profile.setPreference('network.http.use-cache', false);
var options = new firefox.Options().setProfile(profile);

driver = new webdriver.Builder()
          .forBrowser('firefox')
          .setFirefoxOptions(options)
          .setProxy({ proxyType:'manual',
                      ftpProxy:'',
                      httpProxy:'',
                      sslProxy:'',
                      noProxy:'',
                      socksProxy:''
          })
          .build();
watchFail(1,random(nxFail[0],nxFail[1]))          