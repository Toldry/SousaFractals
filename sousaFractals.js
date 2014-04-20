/**
 * Created by Alon Eitan on 17/04/14.
 */

var GRID_MAX_SIZE = 10;

angular.module('sousaModule', [])
    .controller('appController', ['$scope', '$document', function ($scope, $document) {
        $scope.int_horizontalTiles = 3;
        $scope.int_verticalTiles = 3;
        $scope.int_iterations = 3;
        $scope.int_blockSize = 5;
        $scope.color_empty = "#ffffff";
        $scope.color_full = "#000000";

        $scope.ntimes = function (input) {
            var length = parseInt(input);
            var arr = new Array(length);
            for (i = 0; i < length; i++) {
                arr[i] = i;
            }
            return arr;
        };

        $scope.grid = new Array(GRID_MAX_SIZE);
        for (i = 0; i < GRID_MAX_SIZE; i++) {
            $scope.grid[i] = new Array(GRID_MAX_SIZE);
        }

        $scope.resetGrid = function () {
            for (i = 0; i < GRID_MAX_SIZE; i++)
                for (j = 0; j < GRID_MAX_SIZE; j++)
                    $scope.grid[i][j] = false;
        };

        $scope.resetGrid();

        $scope.toggleTile = function (i, j) {
            $scope.grid[i][j] = !$scope.grid[i][j];
        };

        $scope.drawEmpty = function () {
            // Set aliases
            var iterations = parseInt($scope.int_iterations);
            var w = parseInt($scope.int_horizontalTiles);
            var h = parseInt($scope.int_verticalTiles);
            var blockSize = $scope.int_blockSize;

            // Calculate final dimensions of fractal
            var wFinal = Math.pow(w, iterations + 1) * blockSize;
            var hFinal = Math.pow(h, iterations + 1) * blockSize;

            // Get canvas context and set attributes
            var canvas = $document.find('canvas')[0];
            canvas.setAttribute('width', wFinal);
            canvas.setAttribute('height', hFinal);
            var context = canvas.getContext('2d');
            // Initialize the canvas by coloring it entirely empty
            context.fillStyle = $scope.color_empty;
            context.fillRect(0, 0, wFinal, hFinal);

            $scope.int_fractalWidth = wFinal;
            $scope.int_fractalHeight = hFinal;

            // Convert the canvas content to a png file and stick it inside the img tag
            var img = $document.find('img')[0];
            img.src = canvas.toDataURL('image/png');
        }

        $scope.$watch('int_horizontalTiles', function(newValue, oldValue){
            $scope.drawEmpty();
        });

        $scope.$watch('int_verticalTiles', function(newValue, oldValue){
            $scope.drawEmpty();
        });

        $scope.$watch('int_blockSize', function(newValue, oldValue){
            $scope.drawEmpty();
        });

        $scope.$watch('int_iterations', function(newValue, oldValue){
            $scope.drawEmpty();
        });

        $scope.drawFractal = function () {
            // Set aliases
            var iterations = parseInt($scope.int_iterations);
            var w = parseInt($scope.int_horizontalTiles);
            var h = parseInt($scope.int_verticalTiles);
            var blockSize = $scope.int_blockSize;

            // Calculate final dimensions of fractal
            var wFinal = Math.pow(w, iterations + 1) * blockSize;
            var hFinal = Math.pow(h, iterations + 1) * blockSize;

            // Get canvas context and set attributes
            var canvas = $document.find('canvas')[0];
            var context = canvas.getContext('2d');
            context.fillStyle = $scope.color_empty;
            context.fillRect(0, 0, wFinal, hFinal);
            context.fillStyle = $scope.color_full;

            // Get the fractal pattern from the user input
            // This is actually just a subset of the '$scope.grid' variable
            var pattern = new Array(w);
            for (i = 0; i < w; i++) {
                pattern[i] = new Array(h);
                for (j = 0; j < h; j++) {
                    pattern[i][j] = $scope.grid[i][j];
                }
            }

            // Recursive function -- THIS IS WHERE THE MAGIC HAPPENS
            // Parameters:
            // n - current iteration
            // x - horizontal position relative to the entire fractal
            // y - vertical position relative to the entire fractal
            var drawFractal = function (n, x, y) {
                if (n == 0) {
                    for (var i = 0; i < w; i++) {
                        for (var j = 0; j < h; j++) {
                            // If this position is 'full' according to the pattern
                            if (pattern[i][j]) {
                                // Draw a block at the corresponding location on the canvas
//                                context.fillRect((y + j) * blockSize, (x + i) * blockSize, blockSize, blockSize);
                                context.fillRect((x + i) * blockSize, (y + j) * blockSize, blockSize, blockSize);
                            }
                        }
                    }
                }
                else {
                    var ww = Math.pow(w, n);
                    var hh = Math.pow(h, n);
                    for (var i = 0; i < w; i++) {
                        for (var j = 0; j < h; j++) {
                            // If this position is 'full' according to the pattern
                            if (pattern[i][j]) {
                                // Added this condition to and the return values in order
                                // avoid re-calling the function for the vast swaths of empty regions in the fractal
                                if (!(drawFractal(n - 1, x + i * ww, y + j * hh))) {
                                    return false;
                                }
                            }
                        }
                    }
                }

                return true;
            };

            // Root call
            drawFractal(iterations, 0, 0);

            // Convert the canvas content to a png file and stick it inside the img tag
            var img = $document.find('img')[0];
            img.src = canvas.toDataURL('image/png');
        }
    }]);
