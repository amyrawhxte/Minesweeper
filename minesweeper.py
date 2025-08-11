import playerField as pf
import minefield as mf
import guideField as gf

def setUpGame(numRows, numCols, numMines): 
    mines = mf.Minefield(numRows, numCols, numMines)
    guide = gf.GuideField(mines.getField())
    player = pf.PlayerField(guide.getGuideField(), mines.getField())
    return player

def takeTurn(player : pf.PlayerField): 
    print("Options: \n-> M to make a guess\n-> F to place a flag\n-> G to place a G")
    choice = input("Please choice a decision from the option menu: ").capitalize()
    row = int(input('Enter guess row: '))
    col = int(input('Enter guess column: '))

    if choice == 'M': 
        result = player.makeGuess(row, col)
        player.printPlayerField()
        return result
    elif choice == 'F': 
        player.placeFlag(row, col)
        player.printPlayerField()
        return True
    elif choice == 'G': 
        player.placeGuess(row, col)
        player.printPlayerField()
        return True
    else: 
        print("Invalid menu option please try again.")



def main(): 
    numRows = int(input("Enter desired number of rows: "))
    numCols = int(input("Enter desiered number of columns: "))
    numMines = int(input("Enter desired number of mines: "))
    player = setUpGame(numRows, numCols, numMines)
    player.printPlayerField()

    gameStatus = True
    while gameStatus != False: 
        gameStatus = takeTurn(player)
        if gameStatus == False: 
            print("You lost.")
            return
        elif player.isGameOver(): 
            print('You win!')
            return 
        

main()
    
