// I control the Confirm modal window.
// --
// NOTE: This controller gets "modals" injected; but, it is in no way
// different than any other Controller in your entire AngularJS application.
// It takes services, manages the view-model, and knows NOTHING about the DOM.
angular.module('modal').controller('ConfirmModalController', ['$scope', 'modals',
  function($scope, modals){

    var params = modals.params();
    // Setup defaults using the modal params.
    $scope.message = ( params.message || "Are you sure?" );
    $scope.confirmButton = ( params.confirmButton || "Yes!" );
    $scope.denyButton = ( params.denyButton || "Oh, hell no!" );
    // ---
    // PUBLIC METHODS.
    // ---
    // Wire the modal buttons into modal resolution actions.
    $scope.confirm = modals.resolve;
    $scope.deny = modals.reject;

}]);
