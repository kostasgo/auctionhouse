package org.example.auctionhouse.recommendations;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.auctionhouse.model.Auction;
import org.example.auctionhouse.model.User;
import org.example.auctionhouse.repository.UserRepository;
import org.example.auctionhouse.service.AuctionService;
import org.example.auctionhouse.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
@Getter
@Setter
public class MatrixFactorization {

    private final AuctionService auctionService;

    private final UserService userService;

    private Integer features = 5;

    private Double[][] recommendationArray;

    public Double[][] matrixMultiplication(Double[][] UserFeatures, Double[][] AuctionFeatures, Integer features) {

        Double Mul[][] = new Double[UserFeatures.length][AuctionFeatures.length];

        for (int i = 0; i < UserFeatures.length; i++) {
            for (int j = 0; j < AuctionFeatures.length; j++) {
                Mul[i][j] = 0.0;
                for (int k = 0; k < features; k++) {
                    Mul[i][j] += UserFeatures[i][k] * AuctionFeatures[j][k];
                }
            }
        }
        return Mul;
    }

    Double internalProduct(Double[] userFeatures, Double[] auctionFeatures){
        Double internal_prod = 0.0;
        for (int i = 0; i < userFeatures.length; i++)
            internal_prod += userFeatures[i] * auctionFeatures[i];
        return internal_prod;
    }

    public void train(List<Auction> auctions, List<User> users, Integer iterations, Double learning_rate,
                      Double normalization_param, Integer print_every, Double stop_error){

        printArray(recommendationArray);
        System.out.print("START TRAINING\n\n");
        System.out.print("GET USER FEATURES (IF NON EXISTENT RANDOMIZE THEM)\n\n");
        Double[][] allUserFeatures = userService.getAllUserFeatures(users, this.features);
        printArray(allUserFeatures);
        System.out.print("GET AUCTION FEATURES (IF NON EXISTENT RANDOMIZE THEM)\n\n");
        Double[][] allAuctionFeatures = auctionService.getAllAuctionFeatures(auctions, this.features);
        printArray(allAuctionFeatures);
        System.out.print("PREDICTIONS TABLE\n\n");
        Double[][] predictions = this.matrixMultiplication(allUserFeatures, allAuctionFeatures, this.features);
        printArray(predictions);

        System.out.print("CALCULATING MSE EVERY "+ print_every+" ITERATIONS\n\n");
        Double eij = 0.0;
        for (int cycle = 0; cycle < iterations; cycle++){

            for (int i=0; i< users.size(); i++){
                User user = users.get(i);

                for (int j=0; j<auctions.size(); j++){

                    if (this.recommendationArray[i][j] > 0){
                        Auction auction = auctions.get(j);
                        Double[] userFeatures = user.getUserFeatures();
                        Double[] auctionFeatures = auction.getAuctionFeatures();

                        //calculate error
                        eij = this.recommendationArray[i][j] - internalProduct(userFeatures, auctionFeatures);

                        for (int k=0; k<this.features; k++){// add the gradient times the learning rate to the arrays
                            userFeatures[k] += learning_rate * (2 * eij * auctionFeatures[k] - normalization_param * userFeatures[k]);
                            auctionFeatures[k] += learning_rate * (2 * eij * userFeatures[k] - normalization_param * auctionFeatures[k]);
                        }
                        auction.setAuctionFeatures(auctionFeatures);
                        user.setUserFeatures(userFeatures);
                    }
                }
            }


            //calculate mse
            Double mse = 0.0;
            for (int i=0; i< users.size(); i++){
                User user = users.get(i);

                for (int j=0; j<auctions.size(); j++){

                    if (this.recommendationArray[i][j] > 0){
                        Auction auction = auctions.get(j);
                        Double[] userFeatures = user.getUserFeatures();
                        Double[] auctionFeatures = auction.getAuctionFeatures();
                        // add square error to mse
                        mse += ((this.recommendationArray[i][j] - internalProduct(userFeatures, auctionFeatures)) * (this.recommendationArray[i][j] - internalProduct(userFeatures, auctionFeatures)));

                        for (int k=0; k<this.features; k++){
                            mse = mse + (normalization_param / 2) * ((userFeatures[k]*userFeatures[k]) + (auctionFeatures[k]*auctionFeatures[k]));
                        }
                    }
                }
            }
            if (cycle % print_every == 0) System.out.print("ITERATION " + cycle+ ": " + mse + "\n");
            if (mse < stop_error) break;
        }
        System.out.print("\nFINAL PREDICTIONS: \n\n");

        allUserFeatures = userService.getAllUserFeatures(users, this.features);
        allAuctionFeatures = auctionService.getAllAuctionFeatures(auctions, this.features);
        predictions = this.matrixMultiplication(allUserFeatures, allAuctionFeatures, this.features);
        printArray(predictions);

        System.out.print("\nORIGINAL ARRAY WAS: \n\n");

        printArray(this.recommendationArray);

        for (User user : users){
            userService.saveOrUpdate(user);
        }
        for (Auction auction : auctions){
            auctionService.saveOrUpdate(auction);
        }

    }

    public void printArray(Double[][] A){
        for (int i = 0; i<A.length; i++){
            for (int j=0; j<A[i].length; j++){
                System.out.printf("%,.2f ", A[i][j]);
            }
            System.out.print("\n");
        }
        System.out.print("\n\n");
    }
}
