import { expect } from 'chai';
import { SinonSpy, SinonStub, spy, stub } from 'sinon';
import { Interface } from 'readline';
import { Game, GameStatus, TableState } from '../../../src/types';
import * as utilModule from '../../../src/util';
import * as apiModule from '../../../src/services/api';
import * as gameModule from '../../../src/services/game';
import { clearScreen, helpText } from '../../../src/strings';
import { getCommandRoute } from '../../../src/commands/routes';
import { GameplayCommandRouteMapEntry, SpecialCommandRouteMapEntry } from '../../../src/commands/types';

describe('Command routes', () => {
  const game: Game = {
    gameId: 'game-42',
    status: GameStatus.inProgress,
    score: 100,
    table: {
      tableau: 'initial tableau',
      foundation: 'initial foundation',
      stock: 'initial stock',
      waste: 'initial waste'
    } as unknown as TableState
  };

  const initialGame: Game = Object.freeze({ ...game, table: { ...game.table } });

  const modifiedGame: Game = {
    ...game,
    status: game.status,
    score: 110,
    table: {
      tableau: 'modified tableau',
      foundation: 'modified foundation',
      stock: 'modified stock',
      waste: 'modified waste',
    } as unknown as TableState
  };

  let readlineInterfaceCloseSpy: SinonSpy;
  let consoleInfoStub: SinonStub;
  let pressEnterStub: SinonStub;
  let playGameStub: SinonStub;
  let forfeitGameStub: SinonStub;
  let removeGameFileStub: SinonStub;

  let readlineInterface: Interface;

  beforeEach(() => {
    readlineInterfaceCloseSpy = spy();
    consoleInfoStub = stub(console, 'info');
    pressEnterStub = stub(utilModule, 'pressEnter');
    playGameStub = stub(apiModule, 'playGame').resolves(modifiedGame);
    forfeitGameStub = stub(apiModule, 'forfeitGame');
    removeGameFileStub = stub(gameModule, 'removeGameFile');

    readlineInterface = { close: readlineInterfaceCloseSpy } as unknown as Interface;
  });

  afterEach(() => {
    consoleInfoStub.restore();
    pressEnterStub.restore();
    playGameStub.restore();
    forfeitGameStub.restore();
    removeGameFileStub.restore();
  });

  describe('When invoked with "h"', () => {
    let result: SpecialCommandRouteMapEntry;

    beforeEach(async () => {
      result = await getCommandRoute('h') as SpecialCommandRouteMapEntry;
    });

    it('Returns a special command route map entry', () => {
      expect(result.type).to.equal('special');
      expect(result.handler).to.be.a('function');
    });

    describe('When the handler is invoked', () => {
      let handlerResult: Game;

      beforeEach(async () => {
        handlerResult = await result.handler(readlineInterface as unknown as Interface, game);
      });

      it('Clears the screen and prints the help text', () => {
        expect(consoleInfoStub.calledTwice).to.equal(true);
        expect(consoleInfoStub.firstCall.args).to.deep.equal([clearScreen]);
        expect(consoleInfoStub.secondCall.args).to.deep.equal([helpText]);
      });

      it('Waits for the user to press enter', () => {
        expect(pressEnterStub.calledOnce).to.equal(true);
      });

      it('Returns the game unmodified', () => {
        expect(handlerResult).to.equal(game);
        expect(handlerResult).to.deep.equal(initialGame);
      });
    });
  });

  describe('When invoked with "help"', () => {
    let result: SpecialCommandRouteMapEntry;

    beforeEach(async () => {
      result = await getCommandRoute('help') as SpecialCommandRouteMapEntry;
    });

    it('Returns a special command route map entry', () => {
      expect(result.type).to.equal('special');
      expect(result.handler).to.be.a('function');
    });
  });

  describe('When invoked with "f"', () => {
    let result: SpecialCommandRouteMapEntry;

    beforeEach(async () => {
      result = await getCommandRoute('f') as SpecialCommandRouteMapEntry;
    });

    it('Returns a special command route map entry', () => {
      expect(result.type).to.equal('special');
      expect(result.handler).to.be.a('function');
    });

    describe('When the handler is invoked', () => {
      let handlerResult: Game;

      beforeEach(async () => {
        handlerResult = await result.handler(readlineInterface as unknown as Interface, game);
      });

      it('Calls the forfeit game API', () => {
        expect(forfeitGameStub.calledOnce).to.equal(true);
        expect(forfeitGameStub.firstCall.args).to.deep.equal(['game-42']);
      });

      it('Removes the game data file', () => {
        expect(removeGameFileStub.calledOnce).to.equal(true);
      });

      it('Returns a game with an unmodified table state and score and a status of "forfeited"', () => {
        expect(handlerResult.gameId).to.equal('game-42');
        expect(handlerResult.status).to.equal(GameStatus.forfeited);
        expect(handlerResult.score).to.equal(initialGame.score);
        expect(handlerResult.table).to.deep.equal(initialGame.table);
      });
    });
  });

  describe('When invoked with "forfeit"', () => {
    let result: SpecialCommandRouteMapEntry;

    beforeEach(async () => {
      result = await getCommandRoute('forfeit') as SpecialCommandRouteMapEntry;
    });

    it('Returns a special command route map entry', () => {
      expect(result.type).to.equal('special');
      expect(result.handler).to.be.a('function');
    });
  });

  describe('When invoked with "v"', () => {
    let result: SpecialCommandRouteMapEntry;

    beforeEach(async () => {
      result = await getCommandRoute('v') as SpecialCommandRouteMapEntry;
    });

    it('Returns a special command route map entry', () => {
      expect(result.type).to.equal('special');
      expect(result.handler).to.be.a('function');
    });

    describe('When the handler is invoked', () => {
      let handlerResult: Game;

      beforeEach(async () => {
        handlerResult = await result.handler(readlineInterface as unknown as Interface, game);
      });

      it('Calls the play game API with a "claim victory" command', () => {
        expect(playGameStub.calledOnce).to.equal(true);
        expect(playGameStub.firstCall.args).to.deep.equal(['game-42', 'claimVictory']);
      });

      it('Removes the game data file', () => {
        expect(removeGameFileStub.calledOnce).to.equal(true);
      });

      it('Prints a victory message', () => {
        expect(consoleInfoStub.calledOnce).to.equal(true);
        expect(consoleInfoStub.firstCall.args).to.deep.equal(['You won!!!']);
      });

      it('Returns the result from the API', () => {
        expect(handlerResult).to.equal(modifiedGame);
      });
    });
  });

  describe('When invoked with "victory"', () => {
    let result: SpecialCommandRouteMapEntry;

    beforeEach(async () => {
      result = await getCommandRoute('victory') as SpecialCommandRouteMapEntry;
    });

    it('Returns a special command route map entry', () => {
      expect(result.type).to.equal('special');
      expect(result.handler).to.be.a('function');
    });
  });

  describe('When invoked with "q"', () => {
    let result: SpecialCommandRouteMapEntry;

    beforeEach(async () => {
      result = await getCommandRoute('q') as SpecialCommandRouteMapEntry;
    });

    it('Returns a special command route map entry', () => {
      expect(result.type).to.equal('special');
      expect(result.handler).to.be.a('function');
    });

    describe('When the handler is invoked', () => {
      let handlerResult: Game;

      beforeEach(async () => {
        handlerResult = await result.handler(readlineInterface as unknown as Interface, game);
      });

      it('Closes the readline interface', () => {
        expect(readlineInterfaceCloseSpy.calledOnce).to.equal(true);
      });

      it('Returns the game unmodified', () => {
        expect(handlerResult).to.equal(game);
        expect(handlerResult).to.deep.equal(initialGame);
      });
    });
  });

  describe('When invoked with "quit"', () => {
    let result: SpecialCommandRouteMapEntry;

    beforeEach(async () => {
      result = await getCommandRoute('quit') as SpecialCommandRouteMapEntry;
    });

    it('Returns a special command route map entry', () => {
      expect(result.type).to.equal('special');
      expect(result.handler).to.be.a('function');
    });
  });

  describe('When invoked with "s"', () => {
    let result: GameplayCommandRouteMapEntry;

    beforeEach(async () => {
      result = await getCommandRoute('s') as GameplayCommandRouteMapEntry;
    });

    it('Returns a "dealStockToWaste" gameplay entry', () => {
      expect(result.type).to.equal('gameplay');
      expect(result.command).to.equal('dealStockToWaste');
      expect(result.parameters).to.deep.equal([]);
    });
  });

  describe('When invoked with "sw"', () => {
    let result: GameplayCommandRouteMapEntry;

    beforeEach(async () => {
      result = await getCommandRoute('sw') as GameplayCommandRouteMapEntry;
    });

    it('Returns a "dealStockToWaste" gameplay entry', () => {
      expect(result.type).to.equal('gameplay');
      expect(result.command).to.equal('dealStockToWaste');
      expect(result.parameters).to.deep.equal([]);
    });
  });

  describe('When invoked with "ws"', () => {
    let result: GameplayCommandRouteMapEntry;

    beforeEach(async () => {
      result = await getCommandRoute('ws') as GameplayCommandRouteMapEntry;
    });

    it('Returns a "resetWasteToStock" gameplay entry', () => {
      expect(result.type).to.equal('gameplay');
      expect(result.command).to.equal('resetWasteToStock');
      expect(result.parameters).to.deep.equal([]);
    });
  });

  describe('When invoked with "w1"', () => {
    let result: GameplayCommandRouteMapEntry;

    beforeEach(async () => {
      result = await getCommandRoute('w1') as GameplayCommandRouteMapEntry;
    });

    it('Returns a "playWasteToTableau" gameplay entry', () => {
      expect(result.type).to.equal('gameplay');
      expect(result.command).to.equal('playWasteToTableau');
      expect(result.parameters).to.have.length(1);
      expect(result.parameters[0].name).to.equal('tableauIndex');
    });
  });

  describe('When invoked with "w7"', () => {
    let result: GameplayCommandRouteMapEntry;

    beforeEach(async () => {
      result = await getCommandRoute('w7') as GameplayCommandRouteMapEntry;
    });

    it('Returns a "playWasteToTableau" gameplay entry', () => {
      expect(result.type).to.equal('gameplay');
      expect(result.command).to.equal('playWasteToTableau');
      expect(result.parameters).to.have.length(1);
      expect(result.parameters[0].name).to.equal('tableauIndex');
    });
  });

  describe('When invoked with "wa"', () => {
    let result: GameplayCommandRouteMapEntry;

    beforeEach(async () => {
      result = await getCommandRoute('wa') as GameplayCommandRouteMapEntry;
    });

    it('Returns a "playWasteToFoundation" gameplay entry', () => {
      expect(result.type).to.equal('gameplay');
      expect(result.command).to.equal('playWasteToFoundation');
      expect(result.parameters).to.have.length(1);
      expect(result.parameters[0].name).to.equal('foundationIndex');
    });
  });

  describe('When invoked with "wd"', () => {
    let result: GameplayCommandRouteMapEntry;

    beforeEach(async () => {
      result = await getCommandRoute('wd') as GameplayCommandRouteMapEntry;
    });

    it('Returns a "playWasteToFoundation" gameplay entry', () => {
      expect(result.type).to.equal('gameplay');
      expect(result.command).to.equal('playWasteToFoundation');
      expect(result.parameters).to.have.length(1);
      expect(result.parameters[0].name).to.equal('foundationIndex');
    });
  });

  describe('When invoked with "1a"', () => {
    let result: GameplayCommandRouteMapEntry;

    beforeEach(async () => {
      result = await getCommandRoute('1a') as GameplayCommandRouteMapEntry;
    });

    it('Returns a "playTableauToFoundation" gameplay entry', () => {
      expect(result.type).to.equal('gameplay');
      expect(result.command).to.equal('playTableauToFoundation');
      expect(result.parameters).to.have.length(2);
      expect(result.parameters[0].name).to.equal('tableauIndex');
      expect(result.parameters[1].name).to.equal('foundationIndex');
    });
  });

  describe('When invoked with "1d"', () => {
    let result: GameplayCommandRouteMapEntry;

    beforeEach(async () => {
      result = await getCommandRoute('1d') as GameplayCommandRouteMapEntry;
    });

    it('Returns a "playTableauToFoundation" gameplay entry', () => {
      expect(result.type).to.equal('gameplay');
      expect(result.command).to.equal('playTableauToFoundation');
      expect(result.parameters).to.have.length(2);
      expect(result.parameters[0].name).to.equal('tableauIndex');
      expect(result.parameters[1].name).to.equal('foundationIndex');
    });
  });

  describe('When invoked with "7a"', () => {
    let result: GameplayCommandRouteMapEntry;

    beforeEach(async () => {
      result = await getCommandRoute('7a') as GameplayCommandRouteMapEntry;
    });

    it('Returns a "playTableauToFoundation" gameplay entry', () => {
      expect(result.type).to.equal('gameplay');
      expect(result.command).to.equal('playTableauToFoundation');
      expect(result.parameters).to.have.length(2);
      expect(result.parameters[0].name).to.equal('tableauIndex');
      expect(result.parameters[1].name).to.equal('foundationIndex');
    });
  });

  describe('When invoked with "7d"', () => {
    let result: GameplayCommandRouteMapEntry;

    beforeEach(async () => {
      result = await getCommandRoute('7d') as GameplayCommandRouteMapEntry;
    });

    it('Returns a "playTableauToFoundation" gameplay entry', () => {
      expect(result.type).to.equal('gameplay');
      expect(result.command).to.equal('playTableauToFoundation');
      expect(result.parameters).to.have.length(2);
      expect(result.parameters[0].name).to.equal('tableauIndex');
      expect(result.parameters[1].name).to.equal('foundationIndex');
    });
  });

  describe('When invoked with "17"', () => {
    let result: GameplayCommandRouteMapEntry;

    beforeEach(async () => {
      result = await getCommandRoute('17') as GameplayCommandRouteMapEntry;
    });

    it('Returns a "playTableauToTableau" gameplay entry', () => {
      expect(result.type).to.equal('gameplay');
      expect(result.command).to.equal('playTableauToTableau');
      expect(result.parameters).to.have.length(3);
      expect(result.parameters[0].name).to.equal('fromIndex');
      expect(result.parameters[1].name).to.equal('toIndex');
      expect(result.parameters[2].name).to.equal('count');
    });
  });

  describe('When invoked with "173"', () => {
    let result: GameplayCommandRouteMapEntry;

    beforeEach(async () => {
      result = await getCommandRoute('173') as GameplayCommandRouteMapEntry;
    });

    it('Returns a "playTableauToTableau" gameplay entry', () => {
      expect(result.type).to.equal('gameplay');
      expect(result.command).to.equal('playTableauToTableau');
      expect(result.parameters).to.have.length(3);
      expect(result.parameters[0].name).to.equal('fromIndex');
      expect(result.parameters[1].name).to.equal('toIndex');
      expect(result.parameters[2].name).to.equal('count');
    });
  });
});
