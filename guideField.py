import minefield as mf

class GuideField: 
    def __init__(self, minefield):
        self.field = []
        self.setUpField(minefield)
    
    def setUpField(self, minefield): 
        for i in range(len(minefield)): 
            newRow = []
            for j in range(len(minefield[i])): 
                surrounding = self.lookAround(i, j, minefield)
                if minefield[i][j] == 1: 
                    newRow.append(0)
                else: 
                    newRow.append(surrounding)
                
            self.field.append(newRow)
    
    def getGuideField(self): 
        return self.field 

    def lookAround(self, row, col, minefield):
        count = 0
        for i in range(max(row - 1, 0), min(row + 2, len(minefield))):
            for j in range(max(col - 1, 0), min(col + 2, len(minefield[i]))): 
                if (i != row or j != col) and minefield[i][j] != 0: 
                    count += 1        

        return count 