        <script type="text/javascript" src="/js/undo_manager/undomanager.js"></script>
        <script type="text/javascript" src="/js/undo_manager/circledrawer.js"></script>
                
        <script>
            window.onload = function() {
                // with jquery this would be on documentready
                
                var undoManager = new UndoManager();
                
                var circleDrawer = new CircleDrawer('view');
                circleDrawer.setUndoManager(undoManager);
                
                var btnUndo = document.getElementById('btnUndo');
                var btnRedo = document.getElementById('btnRedo');
                var btnClear = document.getElementById('btnClear');
                
                function updateUI() {
                    btnUndo.disabled = !undoManager.hasUndo();
                    btnRedo.disabled = !undoManager.hasRedo();
                }
                undoManager.setCallback(updateUI);

                btnUndo.onclick = function() {
                    undoManager.undo();
                    updateUI();
                };
                btnRedo.onclick = function() {
                    undoManager.redo();
                    updateUI();
                };
                btnClear.onclick = function() {
                    undoManager.clear();
                    updateUI();
                };
                
                updateUI();
            };
        </script>
        <style type="text/css" media="all"> 
            body {
                font-family:arial, sans-serif;
            }
            p {
            	margin: 0 0 1em 0;
            }
            #view {
                margin:.5em 0 .25em 0;
                border:1px solid #ccc;
            }
            .comment {
                color:#999;
                font-size:small;
            }
        </style>
