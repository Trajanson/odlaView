

describe("vocabPracticeSession", function() {
  var session;

  beforeEach(function() {
    session = new vocabPracticeSession();
  });

  it("gets tested successfully", function() {
    expect(1+1).toEqual(2);
  });



  describe("out of the box", function() {
    it("has no associated view", function() {
      expect(session.associatedView).toBeNull();
    });
    it("has no known language for session", function() {
      expect(session.currentKnownLanguage).toBeNull();
    });

    it("has no learning language for session", function() {
      expect(session.currentLearningLanguage).toBeNull();
    });

    it("has no associated flashcard deck", function() {
      expect(session.flashcardDeckForSession).toBeNull();
    });

    it("cannot return the known word on the current card", function() {
      expect(session.currentKnownWord).toThrowError(TypeError);
    });

    it("cannot return the learning word on the current card", function() {
      expect(session.currentLearningWord).toThrowError(TypeError);
    });


  });


});
