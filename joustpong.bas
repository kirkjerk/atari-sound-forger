    rem  *****************************************************
    rem  *  Music Starter using sdata
    rem  *  Based on code posted in the Ballblazer thread at AtariAge:
    rem  *  http://www.atariage.com/forums/index.php?s=&showtopic=130990&view=findpost&p=1615280
    rem  *  Code adapted by Duane Alan Hahn (Random Terrain)
    rem  *  Code further modified by Kirk Israel
    rem  *  Explanation:
    rem  *  The 256-byte limitation is removed when using sdata.
    rem  *  You can fill a whole 4k bank with music if you want.
    rem  *****************************************************
 
    set smartbranching on
 
    rem  *****************************************************
    rem  *  Create aliases for variables
    rem  *****************************************************
    dim duration0=a
    dim duration1=b
 
    dim wastefulInitCheck=c
 
    dim datareader0=w ; just a reminder
    dim datareader1=x ; just a reminder
    dim datareader2=y ; just a reminder
    dim datareader3=z ; just a reminder
 
 
    rem  *  Volume off
    AUDV0=0
    AUDV1=0
 
    rem  *  Initialize duration and set up music
    duration0 = 1
    goto MusicSetup0
 
    rem  *****************************************************
    rem  *  Main game loop starts here.
    rem  *****************************************************
MainLoop
 
    goto GetMusic0
GotMusic0
 
     if wastefulInitCheck = 1 then goto skipCheck
     wastefulInitCheck = 1
     duration1 = 1
     goto MusicSetup1
skipCheck
 
    goto GetMusic1
GotMusic1
 
 
    drawscreen
 
    goto MainLoop
 
 
 
 
    rem  *****************************************************
    rem  *  Music
    rem  *****************************************************
GetMusic0
 
    rem  *  Check for end of current note
    duration0 = duration0 - 1
    if duration0>0 then GotMusic0
 
 
    rem  *  Retrieve channel 0 data
    temp4 = sread(musicData0)
    temp5 = sread(musicData0)
    temp6 = sread(musicData0)
 
 
    rem  *  Check for end of data
    if temp4=255 then duration0 = 1 : goto MusicSetup0
 
 
    rem  *  Play channel 0
    AUDV0 = temp4
    AUDC0 = temp5
    AUDF0 = temp6
 
    rem  *  Set duration
    duration0 = sread(musicData0)
    goto GotMusic0
 
 
MusicSetup0
    sdata musicData0 = y
   0, 0, 0, 1,
   15, 6, 30, 6,
   0, 0, 0, 7,
   15, 6, 30, 10,
   0, 0, 0, 20,
   15, 6, 30, 8,
   0, 0, 0, 21,
   15, 6, 30, 10,
   0, 0, 0, 21,
   15, 6, 30, 7,
   0, 0, 0, 8,
   15, 6, 25, 8,
   0, 0, 0, 7,
   15, 6, 25, 10,
   0, 0, 0, 20,
   15, 6, 25, 11,
   0, 0, 0, 18,
   15, 6, 25, 14,
   0, 0, 0, 16,
   15, 6, 25, 8,
   0, 0, 0, 6,
   15, 6, 27, 8,
   0, 0, 0, 8,
   15, 6, 27, 12,
   0, 0, 0, 18,
   15, 6, 27, 14,
   0, 0, 0, 17,
   15, 6, 27, 16,
   0, 0, 0, 15,
   15, 6, 27, 7,
   0, 0, 0, 6,
   15, 6, 28, 10,
   0, 0, 0, 7,
   15, 6, 28, 11,
   0, 0, 0, 19,
   15, 6, 28, 14,
   0, 0, 0, 15,
   15, 6, 28, 19,
   0, 0, 0, 27,
     255
end
    goto GotMusic0
 
 
GetMusic1
 
    rem  *  Check for end of current note
    duration1 = duration1 - 1
    if duration1>0 then GotMusic1
 
    rem  *  Retrieve channel 1 data
    temp4 = sread(musicData1)
    temp5 = sread(musicData1)
    temp6 = sread(musicData1)
 
 
    rem  *  Check for end of data
    if temp4=255 then duration1 = 1 : goto MusicSetup1
 
 
    rem  *  Play channel 0
    AUDV1 = temp4
    AUDC1 = temp5
    AUDF1 = temp6
 
    rem  *  Set duration
    duration1 = sread(musicData1)
    goto GotMusic1
 
MusicSetup1
    sdata musicData1 = w
   0, 0, 0, 1,
   8, 8, 31, 5,
   0, 0, 0, 23,
   8, 8, 11, 6,
   0, 0, 0, 6,
   8, 8, 31, 7,
   0, 0, 0, 25,
   8, 8, 31, 6,
   0, 0, 0, 9,
   8, 8, 11, 5,
   0, 0, 0, 1,
   8, 8, 31, 7,
   0, 0, 0, 19,
   8, 8, 31, 7,
   0, 0, 0, 23,
   8, 8, 11, 5,
   0, 0, 0, 10,
   8, 8, 31, 6,
   0, 0, 0, 25,
   8, 8, 31, 7,
   0, 0, 0, 6,
   8, 8, 11, 6,
   0, 0, 0, 1,
   8, 8, 31, 5,
   0, 0, 0, 19,
     255
end
    goto GotMusic1
 
 