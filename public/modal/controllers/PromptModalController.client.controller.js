
// I control the Prompt modal window.
// --
// NOTE: This controller gets "modals" injected; but, it is in no way
// different than any other Controller in your entire AngularJS application.
// It takes services, manages the view-model, and knows NOTHING about the DOM.
angular.module('modal').controller('PromptModalController', ['$scope', 'modals',
  function($scope, modals){

    // Setup defaults using the modal params.
    $scope.message = ( modals.params().message || "Give me." );
    // Setup the form inputs (using modal params).
    $scope.form = {
        input: ( modals.params().placeholder || "" )
    };
    $scope.errorMessage = null;
    // ---
    // PUBLIC METHODS.
    // ---
    // Wire the modal buttons into modal resolution actions.
    $scope.cancel = modals.reject;
    // I process the form submission.
    $scope.submit = function() {
        // If no input was provided, show the user an error message.
        if ( ! $scope.form.input ) {
            return( $scope.errorMessage = "Please provide something!" );
        }
        modals.resolve( $scope.form.input );
    };

}]);
