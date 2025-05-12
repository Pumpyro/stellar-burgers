describe('Test: burger-constructor', () => {
  describe('Неавторизованный пользователь', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/ingredients', {
        fixture: 'ingredients.json'
      }).as('getIngredients');

      cy.visit('http://localhost:4000');
      cy.wait('@getIngredients');
    });

    describe('Добавление ингредиентов в конструкторе', () => {
      const ingredients = {
        bun: 'Краторная булка N-200i',
        meat1: 'Биокотлета из марсианской Магнолии',
        meat2: 'Говяжий метеорит (отбивная)',
        sauce: 'Соус фирменный Space Sauce'
      };

      beforeEach(() => {
        Object.values(ingredients).forEach((ingr) => {
          cy.contains(ingr).parent().find('button').click();
        });
      });

      it('Корректное добавление ингредиентов в структуру заказа', () => {
        cy.contains('Оформить заказ')
          .parents('section')
          .first()
          .within(() => {
            cy.contains(ingredients.meat1).should('exist');
            cy.contains(ingredients.meat2).should('exist');
            cy.contains(ingredients.sauce).should('exist');
            cy.contains(ingredients.bun).should('exist');
            cy.contains('6014').should('exist');
          });
      });
      it('Удаление ингредиентов', () => {
        cy.contains('Оформить заказ')
          .parents('section')
          .first()
          .within(() => {
            [ingredients.meat1, ingredients.meat2, ingredients.sauce].forEach(
              (ingr) => {
                cy.contains(ingr)
                  .parent()
                  .find('.constructor-element__action')
                  .click();
              }
            );
            cy.contains(ingredients.bun).should('exist');
            cy.contains('2510').should('exist');
          });
      });

      describe('Модальное окно ингредиента', () => {
        beforeEach(() => {
          cy.contains('Биокотлета из марсианской Магнолии').parent().click();
        });
        it('Открыть модалку', () => {
          cy.get('#modals').should(
            'contain',
            'Биокотлета из марсианской Магнолии'
          );
        });

        it('Закрыть модалку на крестик', () => {
          cy.get('#modals').find('button').click();
          cy.get('#modals').should('not.contain.html');
        });

        it('Закрыть модалку по клику на оверлей', () => {
          cy.get('#modals').parent().click('topLeft');
        });
      });
    });
  });

  describe('Авторизованный пользователь', () => {
    beforeEach(() => {
      cy.setCookie('accessToken', 'testAccess');
      cy.window().then((window) => {
        window.localStorage.setItem('refreshToken', 'testRefresh');
      });
      cy.intercept('GET', '/api/auth/user', {
        fixture: 'user.json'
      }).as('getUser');

      cy.intercept('GET', '/api/ingredients', {
        fixture: 'ingredients.json'
      }).as('getIngredients');

      cy.visit('http://localhost:4000');
      cy.wait(['@getUser', '@getIngredients']);
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      cy.window().then((window) => {
        window.localStorage.removeItem('refreshToken');
      });
    });

    it('Оформление заказа', () => {
      cy.intercept('POST', '/api/orders', {
        fixture: 'order.json',
        delay: 100
      }).as('postOrder');

      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .click();

      cy.contains('Краторная булка N-200i').parent().find('button').click();

      cy.contains('Оформить заказ').click();

      cy.contains('Оформляем заказ...').should('exist');

      cy.wait('@postOrder').then(() => {
        cy.get('#modals').should('contain', '76904');
        cy.get('#modals').parent().click('topRight');
        cy.get('#modals').should('not.contain.html');

        cy.contains('Выберите булки').should('exist');
        cy.contains('Выберите начинку').should('exist');
        cy.contains('Оформить заказ').parent().contains('0').should('exist');
      });
    });
  });
});
