import random

random.seed(123)

class Minefield: 
    def __init__(self, rows, cols, numMines):
        self.field = []
        self.numMines = numMines
        self.rows = rows
        self.cols = cols 
        self.setUpField()
        self.placeMines()
    
    def getField(self): 
        return self.field

    def setUpField(self): 
        for i in range(self.rows): 
            self.field.append([0] * self.cols)

    def lookAround(self, row, col):
        count = 0
        for i in range(min(row - 1, 0), min(row + 2, self.rows)):
            for j in range(min(col - 1, 0), min(col + 2, self.cols)): 
                if i != row and j != col and self.field[i][j] != 0: 
                    count += 1        

        return count 
        
    def placeMines(self):
        count = 0
        while count < self.numMines: 
            row = random.randint(0, self.rows - 1)
            col = random.randint(0, self.cols - 1)
            surrounding = self.lookAround(row, col)
            if self.field[row][col] == 0 and surrounding < 8: 
                count += 1
                self.field[row][col] = 1