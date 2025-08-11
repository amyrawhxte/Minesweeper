import minefield as mf
import guideField as gf

class PlayerField: 
    def __init__(self, guideField, mineField):
        self.player = []

        self.guideField = guideField
        self.mineField = mineField

        self.setUpEmptyField()
        
        print()

    def isGameOver(self):
        # check for spaces not revealed or marked 
        for row in self.player: 
            if ' ' in row or 'G' in row: 
                return False 
            
        # # player has incorrectly marked mine
        # for row in range(len(self.player)): 
        #     for col in range(len(self.player[row])): 
        #         if self.player[row][col] == 'F' and self.mineField[row][col] != 1: 
        #             return False
        
        return True 
        

    def makeGuess(self, row, col): 
        if self.mineField[row][col] == 1: 
            self.player[row][col] = 'X'
            return False 
        else: 
            self.player[row][col] = self.guideField[row][col]
            self.revealSquare(row, col, self.mineField)
            return True
        
    def revealSquare(self, row, col, minefield):
        for i in range(max(row - 1, 0), min(row + 2, len(minefield))):
            for j in range(max(col - 1, 0), min(col + 2, len(minefield[i]))): 
                if (i != row or j != col) and minefield[i][j] != 1: 
                    self.player[i][j] = self.guideField[i][j]

    def placeFlag(self, row, col): 
        self.player[row][col] = 'F'

    def placeGuess(self, row, col): 
        self.player[row][col] = 'G'
    
    def setUpEmptyField(self): 
        for i in range(len(self.mineField)): 
            self.player.append([' '] * len(self.mineField[0]))

    def getPlayerField(self):
        return self.player
    
    def printPlayerField(self):
        print('  ', end="")
        for i in range(0, len(self.player[0])): 
            print('  ' + str(i) + ' ', end='')
        print('\n  -' + '----' * len(self.player[0]))

        count = 0
        for row in self.player: 
            print(str(count) + ' |', end='')
            count += 1
            for char in row: 
                print(' ' + str(char) + ' ' if char != '' else '   ', end='|')
            print('\n  -' + '----' * len(self.player[0]))


