/** Don't change credits bro i will fix¯\_(ツ)_/¯ **/
module.exports.config = {
 name: "dance",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "BELAL BOTX666",
 description: "SAD VEDIO",
 commandCategory: "video",
 usages: "sad vedio",
 cooldowns: 5,
 dependencies: {
 "request":"",
 "fs-extra":"",
 "axios":""
 }
};

module.exports.run = async({api,event,args,client,Users,Threads,__GLOBAL,Currencies}) => {
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
 var hi = [" ,\n┄┉❈✡️⋆⃝চাঁদেড়~পাহাড়✿⃝🪬❈┉┄"];
 var know = hi[Math.floor(Math.random() * hi.length)];
 var link = [ "https://i.imgur.com/iEZPh8A.mp4",
"https://i.imgur.com/imzbAKk.mp4",
"https://i.imgur.com/3Q6hgFy.mp4",
"https://i.imgur.com/0WFBzSx.mp4",
"https://i.imgur.com/eY8vVqz.mp4",
"https://i.imgur.com/kixHWSa.mp4",
"https://i.imgur.com/QXGcO1m.mp4",
"https://i.imgur.com/Hzu182c.mp4",
"https://i.imgur.com/FMH8yJF.mp4",
"https://i.imgur.com/WpJgPNQ.mp4",
"https://i.imgur.com/mxZdcpj.mp4",
"https://i.imgur.com/FGxwFjG.mp4",
"https://i.imgur.com/Dj9BdRI.mp4",
"https://i.imgur.com/wA8YR59.mp4",
"https://i.imgur.com/sA4ecVk.mp4",
"https://i.imgur.com/hXjZ3Q4.mp4",
"https://i.imgur.com/2aTl9hf.mp4",
"https://i.imgur.com/20ruFiA.mp4",
"https://i.imgur.com/eESqfMc.mp4",
"https://i.imgur.com/VTULl9O.mp4",
"https://i.imgur.com/VcwxLHV.mp4",
"https://i.imgur.com/npMypQM.mp4",
"https://i.imgur.com/KpBOYI9.mp4",
"https://i.imgur.com/O6HZpUS.mp4",
"https://i.imgur.com/kthtetX.mp4",
"https://i.imgur.com/1xzd5ay.mp4",
"https://i.imgur.com/A4A5yRB.mp4",
"https://i.imgur.com/BxV1apY.mp4",
"https://i.imgur.com/XxEqR9O.mp4",
"https://i.imgur.com/pc4Ri3D.mp4",
"https://i.imgur.com/enCBPOe.mp4",
"https://i.imgur.com/6rwxPlj.mp4",
"https://i.imgur.com/RmiU1fm.mp4",
"https://i.imgur.com/Tg2q1jz.mp4",
"https://i.imgur.com/tJVlod9.mp4",

];
 var callback = () => api.sendMessage({body:`「 ${know} 」`,attachment: fs.createReadStream(__dirname + "/cache/15.mp4")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/15.mp4")); 
 return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/15.mp4")).on("close",() => callback());
 };
