import { Component, OnInit,TemplateRef } from '@angular/core';
import { RecipesService } from '../../services/recipes.service';
import { Ingredients, Recipes } from '../../models/ingredients.models';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { IngredientsService } from '../../services/ingredients.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {
  modalRef?: BsModalRef;
  ingredientSets: Ingredients[] = [];
  selectedIngredients: Ingredients[] = []; // Initialisez selectedIngredients
  recipe:  Recipes = {
    idRecepies: 0,
    description: '',
    images: '',
    ingredients: [] // Initialisez newRecipe.ingredients à une tableau vide
  };; // Déclarer la propriété recipe
  newRecipe: Recipes = {
    idRecepies: 0,
    description: '',
    images: '',
    ingredients: [] // Initialisez newRecipe.ingredients à une tableau vide
  };
  deleteSuccessAlertVisible = false;

  recipes: any[] = [];
  successMessage: string = '';
  successMessageUpdate: string = '';

  errorMessage: string = '';
  constructor(private ingredientsService: IngredientsService,private recipeService: RecipesService, private modalService: BsModalService) {}

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }
  openUpdateRecipeModal(template1: TemplateRef<any>,recipeId: number):void {
   this.recipe= this.recipes.find(recipe => recipe.idRecepies === recipeId);

    this.modalRef = this.modalService.show(template1);  
  }

  addRecipe(): void {
    this.newRecipe.ingredients = this.selectedIngredients;

    console.log(this.newRecipe);
 
   
    this.modalRef?.hide();
    this.recipeService.addRecipe(this.newRecipe)
      .subscribe(
        response => {
          this.successMessage = 'Recette ajoutée avec succès.';
          this.errorMessage = '';
          console.log('Recette ajoutée avec succès :', response);
          this.loadRecipes();

          // Masquer le formulaire et réinitialiser les messages après 0.2 seconde
          setTimeout(() => {
            this.successMessage = '';
            this.errorMessage = '';
            // Code pour masquer le formulaire (par exemple, utiliser une variable de contrôle)
          }, 400);
        },
        error => {
          this.successMessage = '';
          this.errorMessage = 'Erreur lors de l\'ajout de la recette : ' + error.message;
          console.error('Erreur lors de l\'ajout de la recette :', error);

          // Masquer le formulaire et réinitialiser les messages après 0.2 seconde
          setTimeout(() => {
            this.successMessage = '';
            this.errorMessage = '';
            // Code pour masquer le formulaire (par exemple, utiliser une variable de contrôle)
          }, 400);
        }
      );
  }
// Supposons que vous avez une méthode pour ajouter des ingrédients sélectionnés
addSelectedIngredient(selectedIngredient: Ingredients) {
  this.selectedIngredients.push(selectedIngredient);
}

  ngOnInit(): void {
    this.loadRecipes(); // Chargez les recettes lorsque le composant est initialisé
    this.getAllIngredients();

  }
  getAllIngredients(): void {
    this.ingredientsService.getAllIngredients().subscribe(
      (data: any[]) => {
        this.ingredientSets = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des ingrédients :', error);
      }
    );
  }
  isSelected(ingredient: any): boolean {
    return this.selectedIngredients.includes(ingredient);
  }

  // Méthode pour basculer la sélection d'un ingrédient
  toggleSelection(ingredient: any): void {
    if (this.isSelected(ingredient)) {
      // Si l'ingrédient est déjà sélectionné, le supprimer de la liste
      const index = this.selectedIngredients.indexOf(ingredient);
      this.selectedIngredients.splice(index, 1);
    } else {
      // Sinon, l'ajouter à la liste des ingrédients sélectionnés
      this.selectedIngredients.push(ingredient);
    }
  }

  loadRecipes(): void {
    this.recipeService.getAllRecipes().subscribe((data: any[]) => {
      this.recipes = data; // Mettez à jour la liste des recettes avec les données récupérées du service
    });
  }
  updateRecipe(recipeId: number,recipe:Recipes) {
    this.modalRef?.hide();

    // Logique pour mettre à jour une recette avec l'ID recipeId
    console.log(recipe);
  
    this.recipeService.updateRecipe(recipe).subscribe(
      () => {
        console.log(recipe);
        console.log('Recette mise à jour avec succès.');

        this.successMessage ='Recette  mise à jour  avec succès';
        this.errorMessage = '';
        setTimeout(() => {
           this.successMessage = '';
          this.errorMessage = '';
          // Code pour masquer le formulaire (par exemple, utiliser une variable de contrôle)
        }, 400);
         this.loadRecipes();
               // Mettez à jour les données si nécessaire
      },
      error => {          
        this.errorMessage ="ERRORR";

        setTimeout(() => {
          this.errorMessage ='';
          this.successMessage = '';

          // Code pour masquer le formulaire (par exemple, utiliser une variable de contrôle)
        }, 300);
        console.error('Erreur lors de la mise à jour de la recette :', error);
      }
    );
  }


// recipe.component.ts
confirmDelete(recipeId: number) {
  // Récupérer l'élément par son ID
  const confirmationAlert = document.getElementById('confirmationAlert' + recipeId);
  // Vérifier si l'élément existe avant d'accéder à ses propriétés
  if (confirmationAlert) {
      confirmationAlert.style.display = 'block';
  }
}

cancelDelete(recipeId: number) {
  // Récupérer l'élément par son ID
  const confirmationAlert = document.getElementById('confirmationAlert' + recipeId);
  // Vérifier si l'élément existe avant d'accéder à ses propriétés
  if (confirmationAlert) {
      confirmationAlert.style.display = 'none';
  }
}

deleteRecipe(recipeId: number) {
  // Logique pour supprimer une recette avec l'ID recipeId
  this.recipeService.deleteRecipe(recipeId).subscribe(
      () => {
          console.log('Recette supprimée avec succès.');
           this.successMessage ="Recette supprimée avec succès";
           this.hideConfirmationAlert(recipeId);
          this.loadRecipes();
          // Mettez à jour les données si nécessaire
      },
      error => {
          console.error('Erreur lors de la suppression de la recette :', error);
      }
  );
}
hideConfirmationAlert(recipeId: number) {
  // Récupérer l'élément par son ID
  const confirmationAlert = document.getElementById('confirmationAlert' + recipeId);
  // Vérifier si l'élément existe avant d'accéder à ses propriétés
  if (confirmationAlert) {
      confirmationAlert.style.display = 'none';
  }

}
}
 

