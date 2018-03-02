const Discord = require('discord.js');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const express = require('express');
const app = express();

const adapter = new FileSync('database.json')
const db = low(adapter)

db.defaults({ xp: []}).write()

//DEBUT PARAMETRES HEROKU
app.set('port', (process.env.PORT || 5000))

app.listen(app.get('port'), function(){
})

var bot = new Discord.Client();
var prefix = ("-");

bot.on('ready', () => {
    bot.user.setPresence({ game: { name: '[-help] Le bot', type: 3}});
    console.log("Bot Ready!\n Amuse-toi avec lui!");
});

bot.login('NDE4MzU3MTU4MTM3MDM2ODAw.DXgZHQ.Q_tGfXIi6VpuDIi42a992mXa9ho');

bot.on('message', message => {

    var msgauthor = message.author.id;

    if(message.author.bot)return;

    if(!db.get("xp").find({user: msgauthor}).value()){
        db.get("xp").push({user: msgauthor, xp: 1}).write();
    }else{
        var userxpdb = db.get("xp").filter({user: msgauthor}).find('xp').value();
        var userxp = Object.values(userxpdb)

        db.get('xp').find({user: msgauthor}).assign({user: msgauthor, xp: userxp[1] += 1}).write();

    }

    if(message.content === prefix + "xpstat"){
        var xp = db.get("xp").filter({user: msgauthor}).find('xp').value()
        var xpfinal = Object.values(xp);
        var xp_embed = new Discord.RichEmbed()
            .setTitle('XP de ' + message.author.username)
            .setColor('#046F00')
            .addField("XP :", xpfinal[1] + ' xp')
        message.channel.send({embed: xp_embed});
    }

    if (message.content === prefix + "help"){
        var help_embed = new Discord.RichEmbed()
            .setColor('#FE003B')
            .addField("HELP", "-help : Commandes possibles")
        message.channel.send(help_embed);
        //message.channel.send("Les commandes du bot:\n -help");
    }

    if (message.content === "Salut ShacBot"){
        message.reply("Salut, sa va?");
    }

    if (message.content === prefix + 'ShacTeam'){
        message.reply("La ShacTeam revient vous tuer, toujours la pour vous énerver. En vous jettant des TNT. BOUM! Vous n'allez pas résister!")
    }

});