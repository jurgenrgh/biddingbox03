/*jshint esversion: 6 */
/**
 * @class Board Describes a single board in the boards[] array
 *  
 * @param {number} boardNbr  --- physical sequence number on the board 
 * @param {number} boardIx   --- logical index of the board = index in the boards array 
 * @param {string} sectionId --- letter id assigned by director
 * @param {string} tableId   --- numbering of the tables assigned by director
 */
class Board {
    constructor(boardNbr, boardIx, sectionId, tableId) {
        this.boardNbr = boardNbr;
        this.boardIx = boardIx;
        this.sectionId = sectionId;
        this.tableId = tableId;
    }

    /**
     * Get the dealer from the board number
     * @returns {number} index relative to bidOrder ["W", "N", "E", "S"];
     */
    get dealerIx() {
        var bIx = this.boardNbr - 1;
        var dIx = bIx % 4;
        return dIx; 
    }
    /**
     * Get the vultnerability from the board number
     * @returns {number} index rel to vulOrder = ["None", "NS", "EW", "All"];
     */
    get vulIx() {
        var bIx = this.boardNbr - 1;
        var dIx = bIx % 4;
        vulIx = (Math.floor(bIx / 4) + dIx) % 4;
        return vulIx;
    }
}