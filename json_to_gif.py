import  jpype     
import  asposecells     
jpype.startJVM() 
from asposecells.api import Workbook
workbook = Workbook("rl-video-episode-0.json")
workbook.save("Output.gif")
jpype.shutdownJVM()